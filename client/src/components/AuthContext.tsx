import React, { createContext, useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Location } from "history";

type Props = {
    children?: React.ReactNode
}

type AuthContextType = {
    token: string | null;
    onLogin: (tokenData: string) => Promise<void>;
    onLogout: () => void;
}

type LocationProps = {
    state: {
        from: Location;
    };
};
// interface LocationState {
//     from: {
//         pathname: string;
//     };
// }

export const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => {
    return useContext(AuthContext);
}
const AuthProvider = ({children, ...props}: Props) => {
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation() as unknown as LocationProps;
    const handleLogin = async (tokenData: string) => {
        setToken(tokenData);
        // https://github.com/reach/router/issues/414
        const origin = location.state?.from?.pathname || '/home';
        navigate(origin);
    };
    const handleLogOut = () => {
        setToken(null);
        navigate("/login", {replace: true});
    };
    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;