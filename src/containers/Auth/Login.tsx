import * as React from 'react'
import { connect } from 'react-redux';
import Card from '../../components/Card';
import Center from '../../components/Center';
import Container from '../../components/Container';
import LoginForm from '../../components/LoginForm';
import Title from '../../components/Title';

import { ThunkDispatch } from 'redux-thunk';
import {ILogin, login as loginThunk} from '../../ducks/Users'

interface ILoginProps
{
login: (a:ILogin) => void
}

class Login extends React.Component <ILoginProps>{
    public render(){
        const {login} = this.props
        return (
            <Container center = {true}>
            <Card>
                <Center>
                    <Title>Iniciar sesión</Title>
                    <LoginForm onSubmit={login}/>
                </Center>                        
            </Card>
        </Container>
        )
    }
}

const mapStateToProps = (state:any) => state

const mapDispachToProps = (dispatch:ThunkDispatch<any, any, any>) => ({
    login: (payload:any) => dispatch(loginThunk(payload))
})
export default connect(mapStateToProps, mapDispachToProps)(Login)