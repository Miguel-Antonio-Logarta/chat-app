import React from 'react'

type Props = {
    children?: React.ReactNode;
    close: any;
}

const Modal = ({children, close, ...props}: Props) => {
    return (
        <div className='modal' onClick={close}>
            {children}
        </div>
    )
}

export default Modal;