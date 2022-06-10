import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ErrorMessageContainer from "../components/ErrorMessageContainer";

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
    console.log(data);
  };
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const usernameRegex = /^[A-Za-z0-9_-]{6,30}$/;

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
