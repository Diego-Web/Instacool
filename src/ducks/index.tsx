import { IDataPosts } from './Posts';

export {default as Users} from './Users'
export {default as Posts} from './Posts'

// Procedemos a definir la interfaz del estado de nuestra aplicacion. Este es el mejor lugar.
// Porque va a contener todas las propiedades que va a contener el estado de cada uno de nuestros reducers
// o de nuestros ducks, de post y users. Vamos a exportar istate. Y vamos a partir por cada una de las 
// propiedades de nuestro estado
// Luego lo importamos en User y lo usamos en nuestro retorno de getState
export interface IState {
    Posts: {
        data: IDataPosts
        fetched: boolean
        fetching: boolean
    }
    Users: {
        profileImage?: string
    }
}