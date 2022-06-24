import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Location } from "history";
import { useCookies } from "react-cookie"
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
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [token, setToken] = useState<string | null>(null);
    // const [authenticated, setAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation() as unknown as LocationProps;
    // const getToken = async () => {

    // }

    // useEffect(() => {
    //     // Check if we have a token cookie that is valid
    //     // console.log(cookies);
    //     console.log("Checking if token is valid")
    //     console.log(cookies);
    //     if (Object.keys(cookies).length !== 0) {
    //         setToken(cookies.token);
    //     }
    // }, []);

    const handleLogin = async (tokenData: string) => {
        // Instead why not have it be inside a sessionStorage instead of state.
        // setCookie('token', tokenData, {httpOnly: true});
        setCookie('token', tokenData);
        setToken(tokenData);
        // setAuthenticated(true);
        // Store into a cookie
        // https://github.com/reach/router/issues/414
        const origin = location.state?.from?.pathname || '/home';
        navigate(origin);
    };
    const handleLogOut = () => {
        removeCookie('token');
        setToken(null);
        // setAuthenticated(false);
        navigate("/login", {replace: true});
    };

    // useEffect(() => {
    //     handleLogin
    // });
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