import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";

type Props = {
  // handleLogin: (tokenData: string) => Promise<void>
};

type LoginFormData = {
  usernameOrEmail: string;
  password: string;
};

const Login = (props: Props) => {
  // const auth = useContext(AuthContext);
  const { onLogin } = useAuth();
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    // Send credentials to server to get authenticated.
    console.log(data);
    const body = {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
    };
    console.log(body);
    console.log(JSON.stringify(body));
    axios
      .post(`${process.env.REACT_APP_API}/users/login`, body, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        // console.log(response);
        const data = response.data;
        console.log("success", response.data);
        // props.handleLogin(data.token);
        // console.log("success", data.token);
        onLogin(data.access_token, data.user_id, data.username);
      })
      .catch(function (error) {
        console.log("error", error);
        if (error.response.status === 401) {
          // const formError =
          setError("usernameOrEmail", {
            type: "server",
            message: "Username / email or password is incorrect",
          });
          setError("password", {
            type: "server",
            message: "Username / email or password is incorrect",
          });
        }
      });
  };

  return (
    <div className="login-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h1>Hello Again!</h1>
        <p>Login to access your group chats.</p>
        <input
          type="text"
          autoComplete="off"
          placeholder="Username or Email"
          {...register("usernameOrEmail", { required: true })}
        />
        <input
          type="password"
          autoComplete="off"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.usernameOrEmail &&      
          <div className="error-message center-text">
            {
              errors.usernameOrEmail &&
                errors.password?.message /*note the cross check*/
            }
          </div>
        }
        <button type="submit">Log In</button>
        {/* <p>Forgot your password?</p> */}
        {/* <p>Or Sign Up Here!</p> */}

        <Link to="/SignUp" className="white-link">
          Or Sign Up Here!
        </Link>
      </form>
    </div>
  );
};

export default Login;
