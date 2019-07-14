import { Dispatch } from 'redux';
import { IServices } from '../services'

export interface ILogin {
    email: string
    password: string
}

export default function reducer(state = {}) {
    return state
}

export const login = ({email, password}: ILogin) => 
async (dispatch: Dispatch, getState: () => any, { auth }: IServices) => 
    await auth.signInWithEmailAndPassword(email, password)
// const result = await auth.signInWithEmailAndPassword(email, password)
// // tslint:disable-next-line: no-console
// console.log(result)

export const register = ({email,password}: ILogin) => 
async (dispatch:Dispatch, getstate: () => any, {auth, db }: IServices)=>{
    const userCredential = await auth.createUserWithEmailAndPassword(email, password)
    const { user } = userCredential
    const id = user ? user.uid : undefined
    const doc = db.collection('users').doc(id)
    await doc.set({role: 'user'})
}