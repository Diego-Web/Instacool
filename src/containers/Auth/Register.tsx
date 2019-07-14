import * as React from 'react'
import Card from '../../components/Card';
import Container from '../../components/Container';
import RegisterFrom from '../../components/RegisterForm'
import Title from '../../components/Title';

import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {ILogin, register as registerThunk} from '../../ducks/Users'

interface IRegisterProps {
    register: (a: ILogin) => void
}

class Register extends React.Component<IRegisterProps>{
    public render(){
        const { register } = this.props
        return (
            <Container center = {true} >
            <Card>              
              <Title>Registro</Title>
              <RegisterFrom onSubmit={register}  />                
            </Card>
        </Container>
        )
    }
}

{/* Borrado de la clase, se reemplaza por formulario
    </Center>
    <Input placeholder='Correo' label='Correo' />
    <Input placeholder='Contraseña' label='Contraseña' />
    <Button block = {true} >Enviar</Button>            
    Center>
        <Link to = '/'>Iniciar sesión</Link>                        
    </Center>  */}

const mapStateToProps = (state:any) => state

const mapDispachToProps = (dispatch:ThunkDispatch<any, any, any>) => ({
register: (payload:any) => dispatch(registerThunk(payload))
})

export default connect(mapStateToProps, mapDispachToProps)(Register)