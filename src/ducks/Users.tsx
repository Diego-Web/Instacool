import { AnyAction, Dispatch } from 'redux';
import { IServices } from '../services'

import {IState} from './index'
// Clase 99 - Agregamos los tipos de las acciones
const SET_PROFILE_IMAGE = 'users/set-profile-image'

// ahora los actions creators. El payload va a ser la url por eso es string.
// Lo exportamos e importamos desde nuestro duck de posts
export const setProfileImage = (payload:string) => ({
    payload,
    type: SET_PROFILE_IMAGE,
})

export interface ILogin {
    email: string
    password: string
}
// Agregamos el caso en nuestro reducer despues de terminar el action creator
export default function reducer(state = {}, action: AnyAction) {
    switch (action.type){
        case SET_PROFILE_IMAGE: {
            return {
                ...state,
                profileImage: action.payload
            }
        }
        default: {
            return state
        }
    }    
}

export const login = ({email, password}: ILogin) => 
async (dispatch: Dispatch, getState: () => IState, { auth }: IServices) => 
    await auth.signInWithEmailAndPassword(email, password)
// const result = await auth.signInWithEmailAndPassword(email, password)
// // tslint:disable-next-line: no-console
// console.log(result)

export const register = ({email,password}: ILogin) => 
async (dispatch:Dispatch, getstate: () => IState, {auth, db }: IServices)=>{
    const userCredential = await auth.createUserWithEmailAndPassword(email, password)
    const { user } = userCredential
    const id = user ? user.uid : undefined
    const doc = db.collection('users').doc(id)
    await doc.set({role: 'user'})
}


export const loadUserInitialData = () => 
    async (dispatch: Dispatch, getState: () => IState, {storage, auth}: IServices) => {
        // // tslint:disable-next-line: no-console
        // console.log('object')
        if (!auth.currentUser){
            return            
        }
        // sacamos la referencia de storage
        const storageRef = storage.ref()
        const {uid} = auth.currentUser
        const imageRef = storageRef
            .child('profileImages')
            .child(`${uid}.jpg`)

        const url = await imageRef.getDownloadURL()
        // finalmente despachamos la accion de setprofileimage con la url que acabamos de obtener
        dispatch(setProfileImage(url))
    }

// Para grabar nuestras imagenes/archivos a firebase storage vamos a necesitar una referencia unica
// una sola ruta. Una forma de hacerlo es usando en id del usuario. Por eso se usa auth, y el servicio de storage
// En nuestro thunk despachamos setprofileimage con la url y se puede guardar todo.
// Este thunk fue pasado del duck de Post a este duck de Users (refactorizando los ducks - C102).
// Luego ir al contenedor del perfil (index) y ademas de importar el duck de posts tambien importamos el de users
export const handleProfileImageSubmit = (payload: {file:File}) => 
async (dispatch: Dispatch, getState: () => IState, {auth, storage}: IServices) => {
    // // tslint:disable-next-line: no-console
    // console.log(payload)
    if (!auth.currentUser){
        return
    }
    const {uid} = auth.currentUser
    // ahora tenemos que generar una referencia a nuestro servicio de storage
    const storageRef = storage.ref()
    // lo primero que hacemos es indicar la ruta para guardar nuestro archivo
    // el metodo child recibe un string que es la ruta donde potencialmente podemos guardar el archivo
    // sin embargo podemos hacer referencia al nodo padre
    // usamos child anidados. el metodo put retorna una promesa por eso el uso de await-async
    const response = await storageRef
    .child(`profileImages`)
    .child(`${uid}.jpg` )
    .put(payload.file)
// ya podemos acceder a los metodos de respuesta (response). Luego obtenemos la url de descarga
// y despachar una accion que capture la url 
    const url = await response.ref.getDownloadURL()
    dispatch(setProfileImage(url))
}