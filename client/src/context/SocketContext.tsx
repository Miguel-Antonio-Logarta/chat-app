import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext';
import { useCookies } from "react-cookie"; 

type SocketContextType = {
    socket: WebSocket;
    currentRoom: number | null;
    setCurrentRoom: React.Dispatch<React.SetStateAction<number | null>>;
    isConnected: boolean;
}

type SocketProviderProps = {
    children: React.ReactNode;
}

let ws: WebSocket;

export const SocketContext = createContext<SocketContextType>(null!);
export const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({children, ...props}: SocketProviderProps) => {
    const { onLogout, authenticated } = useAuth();
    const [room, setRoom] = useState<number | null>(null);
    const [cookies] = useCookies(['token']);
    let reconnectAttempts = 0;
    // let pingInterval: NodeJS.Timer;
    const [connected, setConnected] = useState(false);

    const connect = () => {
        // Something faulty with this if statement.
        console.log("something something: ", ws == null, (ws && ws.readyState === 3));
        if (ws == null || (ws && ws.readyState === 3)) {
            // console.log()
            // console.log(ws);
            ws = new WebSocket(`${process.env.REACT_APP_WS}?token=${cookies.token}`);
            ws.addEventListener('open', event => {
                setConnected(true);
                console.log("successful handshake", event);
                reconnectAttempts = 0;
                // Pings the server every 30 seconds
                // pingInterval = setInterval(ping, 30000);
            })
                
            ws.addEventListener('close', event => {
                setConnected(false);
                setTimeout(connect, 5000);
                // Check why server closed the connection
                // If the token we sent was not valid, log us out
                // console.log(event);
                // setConnected(false);
                // // clearInterval(pingInterval);
                // if (event.code === 1008) {
                //     // clearTimeout(ping);
                //     // clearInterval(ping);
                //     // clearInterval(pingInterval);
                //     onLogout();
                // } else {
                //     // ws = null;
                //     // clearInterval(pingInterval);
                //     if (reconnectAttempts >= 3) {
                //         reconnectAttempts = 0;
                //         onLogout();
                //         return;
                //     }
                //     reconnectAttempts += 1;
                //     console.log(reconnectAttempts);
                //     setTimeout(connect, 5000);
                // }

            })
        }
    }

    // This is going to run every time a state change happens, maybe insert another state called "shouldConnect?"
    if (authenticated) {
        connect();
    }

    const value = {
        socket: ws,
        currentRoom: room,
        setCurrentRoom: setRoom,
        isConnected: connected
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;