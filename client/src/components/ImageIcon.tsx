import React from 'react'

type Props = {
    src: string;
    className?: string;
    alt: string;
};

const ImageIcon = (props: Props) => {
    return (
        <img 
            className={props.className} 
            src={`${props.src}`}
            alt={props.alt}
        />
    );
}

export default ImageIcon;