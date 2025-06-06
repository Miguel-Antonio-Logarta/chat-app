import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
    children?: React.ReactNode;
}

const ProtectedRoute = ({ children, ...props }: Props) => {
    const { authenticated } = useAuth();
    const location = useLocation();

    if (!authenticated) {
        return <Navigate to="/login" replace state={{from: location}} />;
    }
    
    return ( 
        <>
            {children}
        </>
    );
}

export default ProtectedRoute