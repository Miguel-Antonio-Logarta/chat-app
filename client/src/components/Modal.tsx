import React from 'react'

type Props = {
    children?: React.ReactNode;
    onClose: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Modal = ({children, onClose, ...props}: Props) => {
    return (
        <div className='modal' onMouseDown={onClose}>
            {children}
        </div>
    )
}

export default Modal;