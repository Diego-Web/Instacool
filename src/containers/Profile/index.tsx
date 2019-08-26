import { chunk } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {submit} from 'redux-form';
import { ThunkDispatch } from 'redux-thunk';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ProfileImg from '../../components/ProfileImg';
import {IState} from '../../ducks'
import * as postsDuck from '../../ducks/Posts'
import * as usersDuck from '../../ducks/Users'
import services from '../../services'

const { auth } = services   
const style={
    container:{
        padding:'15px',
    },
    img: {
        width: '100px',
    },
    row:{
        display:'flex',
        justifyContent: 'space-between',
        marginBottom:'10px',
    },
}

interface IProfileProps {
    fetchPosts: () => void   
    handleProfileImageSubmit: ( a: { file: File }) => void
    submitProfileImg: () => void 
    fetched: boolean
    loading: boolean
    profileImage: string
    data: postsDuck.IPost[][]
    }

class Profile extends React.Component<IProfileProps>{
    // cache para tratar imagenes
    constructor(props: IProfileProps){
        super(props)
        const { fetchPosts, fetched } = props
        if (fetched){
            return
        }
        fetchPosts()
    }

    public render(){
        // despues de usar chunk podemos usar a data
        const { data, submitProfileImg, handleProfileImageSubmit, profileImage } = this.props
        return(
           <div style = {style.container}> 
                <div style = {style.row}>
                    <ProfileImg 
                    profileImage ={profileImage} 
                    onSubmit={handleProfileImageSubmit} 
                    submitProfileImg={submitProfileImg}/>
                    <Button>Agregar</Button>
                </div>
                {data.map( (x, i) =>         
        // Ahora podemos volver a iterar pero ahora con x
                    <div key={ i} style = {style.row}> 
                        {x.map(y => 
                            <Card key={y.imageURL}><img style={style.img} src={y.imageURL} /></Card>                    
                        )}    
                    </div>
                // Iteramos una fila (x,i) y que nos muestre todos los elementos.
                // y en lugar de la imagen que sea src = https://placekitten.com/100/100
                // usamos y.imageURL
                )}
           </div>
                
        )
    }
}

const mapStateToProps = (state : IState) => {
    const { Posts: {data, fetched, fetching}} = state
    const { Users: {profileImage: tempPI}} = state
    const loading = fetching || !fetched
    const profileImage = tempPI || 'https://placekitten.com/100/100'
    /* // tslint:disable-next-line: no-console
    console.log(auth.currentUser && auth.currentUser.uid) */
    // En lugar de usar filter usamos reduce. Tiene 2 parametros. El primero es una funcion. El 
    // segundo el valor inicial que va a ser un arreglo.
    // Este arreglo tendremos que poblarlo con datos.
    // Da error en el arreglo porque inicialmente no vamos a poder mutarlo, no podemos hacer push.
    // Para eso tenemos que indicar que va a ser un arreglo de post, tenemos que ir al duck.
    const filtered = Object.keys(data).reduce((acc, el) => {
    // recibe 2 arg. 1 acumulador (acc) y elemento a iterar (el) que va a ser un id o propiedad del
    // objeto de data
    // Para filtrar agregamos el if
    if(data[el].userId !== (auth.currentUser && auth.currentUser.uid)){
        return acc
    }
    return acc.concat(data[el])
    // if: si el usuario es <> al id del elemento retornamos el acumulador y en el caso 
    // de ser el usuario retornamos el acumulador concatenado al elemento. De esta forma 
    // filtramos los post.  
    // Ahora podemos retornar el elemento de filtered y asignarlo a nuestra propiedad de data
    }, [] as postsDuck.IPost[]) // <- acc
    // cuando retornemos el estado vamos a traer solamente loading pero tambien fetched
    // porque lo estamos usando en el constructor. Y data que son los datos de los posts
    return {
        data: chunk (filtered, 3), // segmenta filtered en pequeños arreglos de 3
        fetched,
        loading,
        profileImage,
    }
}

// Pasamos un gran objeto que tiene todas las propiedades de post, users y submitprofileimg
const mapDispatchToProps = (dispatch: ThunkDispatch<any,any,any>) => bindActionCreators({
    ...postsDuck,
    ...usersDuck,
    submitProfileImg: () => submit('profileImg'),
},dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Profile)