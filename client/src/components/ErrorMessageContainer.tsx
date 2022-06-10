import React from 'react'

type ErrorMessageContainerProps = {
    children?: React.ReactNode;
};

const ErrorMessageContainer = ({ children }: ErrorMessageContainerProps) => {
  return (
    <p className="error-message">{children}</p>
  )
}

export default ErrorMessageContainer;