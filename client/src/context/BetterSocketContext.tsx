// import { connect } from "http2";
import React, { createContext, useContext } from "react";
import { useCookies } from "react-cookie";
import { SendMessage } from "../types";
import { camelCaseKeys, snakeCaseKeys } from "../utils/Utilities";
import ReconnectingWebSocket from "reconnecting-websocket";
import { useAuth } from "./AuthContext";

type BetterSocketProviderProps = {
    children?: React.ReactNode;
}

type BetterSocketContextType = {
    // socket: WebSocket;
    socket: ReconnectingWebSocket;
    isConnected: () => boolean;
    on: (eventType: string, f: (payload: unknown) => void) => Function;
    off: (eventType: string, f: Function) => void;
    sendMessage: (eventType: string, payload: any) => void;
}

const options = {
    connectionTimeout: 1000,
    maxRetries: 10,
    startClosed: true
};

// let rws: ReconnectingWebSocket;

export const BetterSocketContext = createContext<BetterSocketContextType>(null!); 
export const useBetterSocket = () => useContext(BetterSocketContext);

export const BetterSocketProvider = ({children}: BetterSocketProviderProps) => {
    const {authenticated} = useAuth();
    const [cookies] = useCookies(['token']);
    // rws = null!;
    const eventListeners: Map<string, Array<Function>> = new Map();
    let rws: ReconnectingWebSocket = new ReconnectingWebSocket(`${process.env.REACT_APP_WS}?token=${cookies.token}`, [], options);

    const on = (eventType: string, f: (payload: unknown) => void): Function => {
        // Adds event listener to socket.
        const eventListener = eventListeners.get(eventType);
        if (eventListener) {
            eventListener.push(f);
            console.log(f);
            return () => eventListener.filter((callback) => callback !== f);
        } else {
            eventListeners.set(eventType, [f]);
            console.log(f);
            return () => eventListeners.get(eventType)!.filter((callback) => callback !== f);
        }
    }

    const off = (eventType: string, f: Function): void => {
        // Removes an action
        const eventListener = eventListeners.get(eventType);
        if (eventListener) {
            eventListeners.set(eventType, eventListener.filter((callback) => callback !== f));
        }
    }

    const sendMessage = (eventType: string, payload: any) => {
        rws.send(JSON.stringify({
            type: eventType,
            payload: snakeCaseKeys(payload)
        }))
    }

    if (authenticated) {
        rws = new ReconnectingWebSocket(`${process.env.REACT_APP_WS}?token=${cookies.token}`);
        
        rws.addEventListener('open', (event) => {
            console.log(event);
        })

        rws.addEventListener('message', (event) => {
            const data = camelCaseKeys(JSON.parse(event.data));
            const eventListener = eventListeners.get(data.type);
            console.log("Message event", data);
            if (eventListener) {
                eventListener.forEach((callback) => callback(data.payload));
            }
        })

        rws.addEventListener('close', (event) => {
            console.log(event);
        })

        rws.addEventListener('error', (event) => {
            console.log(event);
        })
    }

    const value: BetterSocketContextType = {
        socket: rws,
        isConnected: () => rws.readyState === 1,
        on: on,
        off: off,
        sendMessage: sendMessage
    }

    return (
        <BetterSocketContext.Provider value={value}>
            {children}
        </BetterSocketContext.Provider>
    )
}

export default BetterSocketProvider;