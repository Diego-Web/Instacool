import {firestore} from 'firebase';
import { AnyAction, Dispatch } from 'redux';
import { IServices } from '../services';

// Definicion de tipos para nuestras acciones
const START = 'posts/fetch-start'
const SUCCESS = 'posts/fetch-success'
const ERROR = 'posts/fetch-error'

// creamos una interfaz para indicar que tipo de datos es payload
export interface IDataPosts {
    [key: string]:{
        comment: string,
        userId: string,
        createdAt: firestore.Timestamp
        imageURL: string
    }
}

// Definimos nuestros actions creators
const fetchStart = () => ({
    type: START,
})
const fetchSuccess = (payload: IDataPosts) => ({
    payload,
    type: SUCCESS,
})
const fetchError = (error: Error) => ({
    error,
    type: ERROR,
})

// definimos el estado inicial: contiene data, fetched y fetching
// los dos ultimos porque traemos nuestros datos cuando estamos en la ruta de  newsfeed

const initialState = {
    data: {},
    fetched: false,
    fetching: false,
}

// definimos nuestro reducer - Clase 75 
// action: AnyAction es porque las acciones convencionales van a venir solamente con un type
export default function reducer(state = initialState, action: AnyAction){
    switch (action.type){
        case START:
        // creamos una copia de state y cambiamos atr fetching
        // esto para mostrar al usuario que en el fdo traemos los posts
                return {
                    ...state,
                    fetching: true,
                }
        // cuando tenemos exito retornamos una copia del estado y devolvemos la 
        // propiedad de data que es igual a action.payload
        // tenemos que cambiar fetched en caso de exito y fetching a falso
        case SUCCESS:
            return {
                ...state,
                data: action.payload,
                fetched: true,
                fetching: false,
            }
        // cuando ocurre un error. Creamos una copia del estado y al igual que data
        // llenamos el atributo de error el cual viene de action.error
        // modificamos fetching pero NO fetched porque sino estariamos indicando que 
        // nos trajimos los datos.
        case ERROR:
            return{
                ...state,
                error: action.error,
                fetching: false,
            }           
        default:
           return state
    }
    return state
}

// definimos el thunk el cual trae los datos y despacha estas 3 acciones
export const fetchPosts = () =>
async (dispatch: Dispatch, getState: () => any, {db, storage}: IServices) => {
    // Antes de hacer algo despachamos nuestro action creator fetchStart
    dispatch(fetchStart())
    // Vamos a intentar hacer un efecto y puede o no tener exito,
    // Utilizamos try-catch para manejar el error y en caso de tener error 
    // lo despachamos aqui mismo
    try {
        const snaps = await db.collection('posts').get()
        const posts = {}
        snaps.forEach(x => posts[x.id] = x.data())
    //     // C79- creamos un objeto que contiene los ids y url de descarga de nuestras imagenes
        const imgIds = await Promise.all(Object.keys(posts).map(async x => {
    // acá resolvemos la url de la imagen y devolvemos un objeto el cual va a contener       
    // el id del post y el string de la url.
    // tslint:disable-next-line: no-console        
        const ref = storage.ref(`posts/${x}.jpg`)       
        const url = await ref.getDownloadURL() // <getDownurl devuelve promesa x eso await
    // arreglo con el 1 argumento el id del post y 2 la url
        return [x, url] 
    }))

    const keyedImages = {}
    imgIds.forEach(x => keyedImages[x[0]] = x[1])

    Object.keys(posts).forEach(x => posts[x] = {
        ...posts[x],
        imageURL: keyedImages[x],
    })
    // // tslint:disable-next-line: no-console
    // console.log(posts)
    dispatch(fetchSuccess(posts))
    } catch (e) {
        // tslint:disable-next-line: no-console
        console.log(e)
        dispatch(fetchError(e))
        
    }
}

// definimos los dos thunks de like y share
export const like = (id: string) => 
        async (dispatch: Dispatch, getState: () => any, { auth }: IServices) =>{
        if (!auth.currentUser){
            return
        }
        const token = await auth.currentUser.getIdToken()       
        // C87 - Conectando react con backend + C88 agregar token auth
        const result = await fetch('/api/posts', {
            headers: {
                authorization: token
            }
        })
        const text = await result.text()
        // tslint:disable-next-line: no-console
        console.log(text)
    }

export const share = (id: string) => 
    async (dispatch: Dispatch, getState: () => any, {}: IServices) =>{
// tslint:disable-next-line: no-console
        console.log(id)
    }
