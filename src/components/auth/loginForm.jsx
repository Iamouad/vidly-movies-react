import React from 'react';
import Joi from 'joi-browser'
import Form from '../common/form';
import auth from '../../services/authService';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';

class LoginForm extends Form {
    state = { 
        data: {username:'', password: ''},
        errors: {}

     }

     schema = {
         username:Joi.string().required().email().label('Username'),
         password:Joi.string().required().label('Password'),

     };

    

    doSubmit = async() =>{
        //call the server
        try {
            const {data} = this.state
            await auth.login(data.username, data.password)
            const {state} = this.props.location
            window.location = state ?  state.from.pathname : "/";
        } catch (ex) {
            if(ex.response && ex.response.status === 400){
                toast.error(ex.response.data);
                const {errors} = this.state;
                errors.username = ex.response.data;
                this.setState({errors})
            }
        }
    }
      

    render() { 
        if(auth.getCurrentUser()) return (<Redirect to="/"/>)
        return ( <div className="container">
            <h1>Login</h1>
            <form onSubmit={this.handleSubmit }>
            {this.renderInput("username", "Username")}
            {this.renderInput("password", "Password", "password")}            

            {this.renderButton('Login')}
            

            </form>
        </div> );
    }
}
 
export default LoginForm;