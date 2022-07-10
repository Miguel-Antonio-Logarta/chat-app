import React, { createContext, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Location } from "history";
import { useCookies } from "react-cookie";

type Props = {
  children?: React.ReactNode;
};

type AuthContextType = {
  userId: number | null;
  username: string | null;
  authenticated: boolean;
  onLogin: (
    tokenData: string,
    userId: number,
    username: string
  ) => Promise<void>;
  onLogout: () => void;
};

type LocationProps = {
  state: {
    from: Location;
  };
};

export const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => {
  return useContext(AuthContext);
};
const AuthProvider = ({ children, ...props }: Props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation() as unknown as LocationProps;

  const handleLogin = async (
    tokenData: string,
    userId: number,
    username: string
  ) => {
    // setCookie('token', tokenData, {httpOnly: true});
    setCookie("token", tokenData);
    // setToken(tokenData);
    setUserId(userId);
    setUsername(username);
    setAuthenticated(true);
    // Store into a cookie
    // https://github.com/reach/router/issues/414
    const origin = location.state?.from?.pathname || "/home";
    navigate(origin);
  };
  const handleLogOut = () => {
    removeCookie("token");
    setAuthenticated(false);
    navigate("/login", { replace: true });
  };

  const value = {
    username,
    userId,
    authenticated,
    onLogin: handleLogin,
    onLogout: handleLogOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
