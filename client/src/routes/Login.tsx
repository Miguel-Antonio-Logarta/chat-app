import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom';
import { AuthContext, useAuth } from '../components/AuthContext';

type Props = {
  // handleLogin: (tokenData: string) => Promise<void>
}

type LoginFormData = {
  usernameOrEmail: string;
  password: string;
}

const Login = (props: Props) => {
  // const auth = useContext(AuthContext);
  const {onLogin} = useAuth();
  const { register, handleSubmit } = useForm<LoginFormData>();
  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    // Send credentials to server to get authenticated.
    // console.log(data);
    const body = {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password
    }
    axios.post("http://127.0.0.1:8000/user/login", body)
      .then(function (response) {
        // console.log(response);
        const data = response.data;
        // props.handleLogin(data.token);
        console.log(data.token);
        onLogin(data.token);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  return (
    <div className='login-page'>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <h1>Hello Again!</h1>
            <p>Login to access your group chats.</p>
            <input 
              type="text" 
              autoComplete='off' 
              placeholder='Username or Email' 
              {...register("usernameOrEmail", {required: true})}
            />
            <input 
              type="password" 
              autoComplete='off' 
              placeholder='Password' 
              {...register("password", {required: true})}
            />
            <button>Log In</button>
            <p>Forgot your password?</p>
            {/* <p>Or Sign Up Here!</p> */}

            <Link to="/SignUp" className="white-link">
              Or Sign Up Here!
            </Link>
        </form>
    </div>
  )
}

export default Login