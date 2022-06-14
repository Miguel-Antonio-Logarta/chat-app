import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Props = {
    children?: React.ReactNode;
}

const ProtectedRoute = ({ children, ...props }: Props) => {
    const token = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{from: location}} />;
    }
    
    return children;
}

export default ProtectedRoute