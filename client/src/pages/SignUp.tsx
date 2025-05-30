import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
import { emailRegex, usernameRegex } from "../data/constants";
type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const { onLogin } = useAuth();
  const {
    setError,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    // console.log(data);
    const body = {
      username: data.username,
      email: data.email,
      password: data.password
    }
    axios.post(`${process.env.REACT_APP_API}/users/signup`, body, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      // onLogin(response.data.access_token);
      onLogin(response.data.access_token, response.data.user_id, response.data.username);
    })
    .catch(error => {
      // Code is 409 when user or email already exists
      if (error.response.status === 409) {
        setError('username', {
          type: 'server',
          message: error.response.data.detail.username
        })
        setError('email', {
          type: 'server',
          message: error.response.data.detail.email
        })
      }
      // Code is 422 when form validation fails
      else if (error.response.status === 422) {
        console.log("There was a problem validating your form in the server", error.response);
      }
      // console.log(error);
    })

  };
  

  return (
    <div className="sign-up-page">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h1>Welcome!</h1>
        <p>Sign up to begin chatting with others.</p>
        <input
          placeholder="Username"
          autoComplete="off"
          {...register("username", {
            required: "Please enter a username",
            pattern: {
              value: usernameRegex,
              message: "Please enter a valid username",
            },
            minLength: {
              value: 6,
              message: "Username must be between 6 to 30 characters long",
            },
            maxLength: {
              value: 30,
              message: "Username must be between 6 to 30 characters long",
            },
          })}
        />
        {errors.username && (
          <ErrorMessage
            name="username"
            errors={errors}
            as={<ErrorMessageContainer />}
          />
        )}

        <input
          placeholder="Email"
          {...register("email", {
            pattern: {
              value: emailRegex,
              message: "Please enter a valid email",
            },
          })}
        />
        {errors.email && (
          <ErrorMessage
            name="email"
            errors={errors}
            as={<ErrorMessageContainer />}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          autoComplete="off"
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
            maxLength: {
              value: 64,
              message: "Password's max length is 64 characters long",
            },
          })}
        />
        {errors.password && (
          <ErrorMessage
            name="password"
            errors={errors}
            as={<ErrorMessageContainer />}
          />
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          autoComplete="off"
          {...register("confirmPassword", {
            required: 'Retype your password',
            validate: (p: string) => {
              if (p !== watch("password")) {
                return "Your passwords do not match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <ErrorMessage
            name="confirmPassword"
            errors={errors}
            as={<ErrorMessageContainer />}
          />
        )}

        <button type="submit">Sign Up</button>
        <Link to="/login" className="white-link">
          Or Log In Here!
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
