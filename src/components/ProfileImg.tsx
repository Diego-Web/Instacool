import * as React from 'react'
import { Field, InjectedFormProps, reduxForm, WrappedFieldInputProps, WrappedFieldProps} from 'redux-form';

const style={
    file: {
        display: 'none',
    },
    img:{
        borderRadius:'100%',
        height: '100px',        
        width: '100px',
    }
}

// La siguiente funcion se hace por este error
// Lambdas are forbidden in JSX attributes due to their rendering performance impact (jsx-no-lambda)
// Vamos a tener error de tipo con input y e por any implicito
const handleChange = (submitProfileImg: () => void, input: WrappedFieldInputProps) => async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const {onChange}= input
        const { files } = e.target
        if (files) {
            // uso await para esperar antes de enviar el formulario. Por eso el async antes del evento
            await onChange(files[0])
            submitProfileImg()
        }
    }

// Declaramos la interfaz que se usa para indicar el tipo de input en Renderfield y en la clase
// para indicar que recibira un profileimg
interface IProfileImg{
        submitProfileImg: () => void,
        profileImage: string,
}
// indicamos el tipo de renderfield al igual que con el formulario de inicio de sesion y registro 
// ya que el input tiene any implicito.
// Usamos html para que quede oculto el boton y al pinchar sobre la imagen se comporte como el boton
const RenderField: React.StatelessComponent<WrappedFieldProps & IProfileImg> = ( {input, submitProfileImg, profileImage} ) => 
// envolvemos la imagen en una etiqueta label con la propiedad htmlFor. Esto va a hacer que cuando
// pinchemos la imagen simule que hacemos un click en el input. 
// Para que funcione cambiamos {...input} por onChange, como input se recibe de renderfield se hace una funcion curried
// C95 - al ser curried handleChange toma 1er arg submirPI y luego input segun ({input, submitPI})
<div>
    <input onChange = { handleChange(submitProfileImg, input) } style={style.file} type='file' id='profileImage'/>    
    <label htmlFor='profileImage'>
        <img style={style.img} src={profileImage} />               
    </label> 
</div>


class ProfileImg extends React.Component <InjectedFormProps<{}, IProfileImg> & IProfileImg> {
    public render(){
        const { handleSubmit, submitProfileImg, profileImage } = this.props
          return(
            <form onSubmit={handleSubmit}>
                <Field 
                    name='profileImg' 
                    profileImage = {profileImage}
                    component={RenderField} 
                    submitProfileImg={submitProfileImg} />
            </form>               
        )
    }
}

// Vamos a exportar por defecto a la funcion de reduxForm y la segunda vez que llamemos le vamos a 
// pasar el perfil de la imagen. Y la primera vez lo inicializamos con el nombre del formulario.
// en este caso va a ser profileImg 
export default reduxForm<{},IProfileImg>({
    form: 'profileImg'
})(ProfileImg)