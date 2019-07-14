import * as React from 'react'
import {Link} from 'react-router-dom';
import {Field, InjectedFormProps, reduxForm} from 'redux-form';
import Button from './Button';
import Center from './Center';
import Input from './Input';

class RegisterForm extends React.Component<InjectedFormProps <{email: string}>>{
    public render(){
        const {handleSubmit} = this.props
        return(
           <form onSubmit={handleSubmit}> 
              {/* <Input placeholder='Correo' label='Correo' />
              <Input placeholder='Contraseña' label='Contraseña' />             */}
              <Field label='Correo' placeholder='Correo' name='email' type='email' component={Input} />
              <Field label='Contraseña' placeholder='Contraseña' name='password' type='password' component={Input} />
              <Button block = {true} >Enviar</Button>            
              <Center>
                  <Link to = '/'>Iniciar sesión</Link>                        
              </Center>
           </form> 
        )
    }
}

export default reduxForm({
    form: 'register',
})(RegisterForm)
