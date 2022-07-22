// import { connect } from "http2";
import React, { createContext, useContext } from "react";
import { useCookies } from "react-cookie";
import { EventTypes, SendMessage } from "../types";
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
    on: (eventType: string, f: (payload: any) => void) => Function;
    off: (eventType: string, f: Function) => void;
    onError: (eventType: string, f: (payload: any) => void) => Function;
    offError: (eventType: string, f: Function) => void;
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
    const eventListeners: Map<string, Array<Function>> = new Map();
    const errorListeners: Map<string, Array<Function>> = new Map();

    let rws: ReconnectingWebSocket = new ReconnectingWebSocket(`${process.env.REACT_APP_WS}?token=${cookies.token}`, [], options);

    const on = (eventType: string, f: (payload: any) => void): Function => {
        // Adds event listener to socket.
        console.table(eventListeners);
        const eventListener = eventListeners.get(eventType);
        if (eventListener) {
            eventListener.push(f);
            // console.log(f);
            return () => eventListener.filter((callback) => callback !== f);
        } else {
            eventListeners.set(eventType, [f]);
            // console.log(f);
            return () => eventListeners.get(eventType)!.filter((callback) => callback !== f);
        }
    }

    const off = (eventType: string, f: Function): void => {
        // Removes an action
        const eventListener = eventListeners.get(eventType);
        if (eventListener) {
            eventListeners.set(eventType, eventListener.filter((callback) => callback !== f));
        }
        console.table(eventListeners);
    }

    const onError = (eventType: string, f: (payload: any) => void): Function => {
        // Adds event listener to socket.
        console.table(errorListeners);
        const errorListener = errorListeners.get(eventType);
        if (errorListener) {
            errorListener.push(f);
            // console.log(f);
            return () => errorListener.filter((callback) => callback !== f);
        } else {
            errorListeners.set(eventType, [f]);
            // console.log(f);
            return () => errorListeners.get(eventType)!.filter((callback) => callback !== f);
        }
    }

    const offError = (eventType: string, f: Function): void => {
        // Removes an action
        const errorListener = errorListeners.get(eventType);
        if (errorListener) {
            errorListeners.set(eventType, errorListener.filter((callback) => callback !== f));
        }
        console.table(errorListeners);
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
            console.log("open: ", event);
        })

        rws.addEventListener('message', (event) => {
            const data = camelCaseKeys(JSON.parse(event.data));
            
            // TODO: Fix this part
            if (data.type === "ERROR") {
                const errorListener = errorListeners.get(data.type);
                console.log("ERROR: ", data);
                if (errorListener) {
                    errorListener.forEach((callback) => callback(data.payload));
                }
            } 
            else {
                const eventListener = eventListeners.get(data.type);
                console.log("Message: ", data);
                if (eventListener) {
                    eventListener.forEach((callback) => callback(data.payload));
                }
            }
        })

        rws.addEventListener('close', (event) => {
            console.log("closing: ", event);
            // console.log(event);
        })

        rws.addEventListener('error', (event) => {
            console.log("error: ", event);
        })
    }

    const value: BetterSocketContextType = {
        socket: rws,
        isConnected: () => rws.readyState === 1,
        on: on,
        off: off,
        onError: onError,
        offError: offError,
        sendMessage: sendMessage
    }

    return (
        <BetterSocketContext.Provider value={value}>
            {children}
        </BetterSocketContext.Provider>
    )
}

export default BetterSocketProvider;