import { createContext, useContext } from 'react'
import { io, Socket } from 'socket.io-client'

type SocketContextType = {
    socket: Socket;
}

type SocketProviderProps = {
    children: React.ReactNode;
}

export const socket = io(`${process.env.REACT_APP_WS}`, {
    path: '/ws/socket.io'
}); 

export const SocketContext = createContext<SocketContextType>(null!);
export const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({children, ...props}: SocketProviderProps) => {
    const value = {
        socket: socket
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;