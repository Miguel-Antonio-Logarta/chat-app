import { createContext, useContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext';

// type SocketContextType = {
//     socket: Socket;
// }

type SocketContextType = {
    socket: WebSocket;
    currentRoom: number | null;
    setCurrentRoom: React.Dispatch<React.SetStateAction<number | null>>;
}

type SocketProviderProps = {
    children: React.ReactNode;
}

// export const socket = io(`${process.env.REACT_APP_WS}`, {
//     path: '/ws/socket.io'
// }); 

// const ws = new WebSocket(`${process.env.REACT_APP_WS}`);
let ws: WebSocket;
// console.log(`${process.env.REACT_APP_WS}/ws`);
// export const SocketContext = createContext<WebSocket>(ws);
export const SocketContext = createContext<SocketContextType>(null!);
export const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({children, ...props}: SocketProviderProps) => {
    const { token, onLogout } = useAuth();
    const [room, setRoom] = useState<number | null>(null);
    // const socket = io(`${process.env.REACT_APP_WS}`, {
    //     path: '/ws/socket.io'
    // }); 

    // if (token) {
    //     // socket.connect(`${process.env.REACT_APP_WS}`, {
    //     //     path: '/ws/socket.io'
    //     // })
    //     socket.connect();
    // }
    if (token) {
        ws = new WebSocket(`${process.env.REACT_APP_WS}?token=${token}`);
        
        ws.addEventListener('close', event => {
            // Check why server closed the connection
            // If the token we sent was not valid, log us out
            console.log(event);
            if (event.code === 1008) {
                onLogout();
            }
        })
        
        ws.addEventListener('open', event => {
            console.log("successful handshake", event);
        })
    }
    const value = {
        socket: ws,
        currentRoom: room,
        setCurrentRoom: setRoom
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;