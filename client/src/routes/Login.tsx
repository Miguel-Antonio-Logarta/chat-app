import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom';

type LoginFormData = {
  usernameOrEmail: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    // Send credentials to server to get authenticated.
    console.log(data);
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