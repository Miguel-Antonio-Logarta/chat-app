import { createContext, useContext, useEffect, useState } from "react";
import { useBetterSocket } from "./BetterSocketContext";

type ChatAppContextProviderProps = {
    children?: React.ReactNode;
}

type GroupChatType = {
    roomId: number;
    name: string;
    isGroupChat: boolean;
    createdOn: string;
}

type ChatAppContextType = {
    groupChats: Array<GroupChatType>;
    setGroupChats: React.Dispatch<React.SetStateAction<GroupChatType[]>>;
    currentChatRoom: CurrentChatRoomType | null;
    setCurrentChatRoom: React.Dispatch<React.SetStateAction<CurrentChatRoomType | null>>;
}

type UserInfoType = {
    userId: number;
    username: string;
}

type CurrentChatRoomType = {
    roomId: number;
    roomName: string;
    isGroupChat: boolean;
    onlineUsers: Array<UserInfoType>;
    offlineUsers: Array<UserInfoType>;
}

export const ChatAppContext = createContext<ChatAppContextType>(null!);
export const useChat = () => useContext(ChatAppContext);
export const ChatAppContextProvider = ({children}: ChatAppContextProviderProps) => {
    // Holds the global state and handles authentication and web socket
    const {socket, isConnected, on, off, sendMessage} = useBetterSocket();

    const friends = [];
    const [groupChats, setGroupChats] = useState<Array<GroupChatType>>([]);
    const [currentChatRoom, setCurrentChatRoom] = useState<CurrentChatRoomType | null>(null);
    const friendDMs = [];

    useEffect(() => {
        sendMessage("GET_GROUP_CHATS", {});

        const handleGroupChats = (payload: any) => {
            console.log("Group Chats", payload);
            setGroupChats(payload);
        }

        const handleLeaveRoom = (payload: any) => {
            setGroupChats((groupChats: any) => 
                groupChats.filter((room: any) => room.roomId !== payload.roomId)
            );
        }

        on("GET_GROUP_CHATS", handleGroupChats);
        on("LEAVE_ROOM", handleLeaveRoom);

        return () => {
            off("GET_GROUP_CHATS", handleGroupChats);
            off("LEAVE_ROOM", handleLeaveRoom);
        }
    }, [sendMessage, on, off])

    // const sendMessage = (eventType: string, payload: any, f: (payload: unknown) => void) => {
    //     socket.send(JSON.stringify({
    //         type: eventType,
    //         payload: payload
    //     }))

    //     // How do we remove this event listener when the object that called it unmounts?
    //     // Instead, we should store event listeners in an array
    //     socket.addEventListener('message', (event) => {
    //         const data = JSON.parse(event.data);
    //         if (data.type === eventType) {
    //             f(data.payload);
    //         }
    //     })
    // }

    const value = {
        groupChats: groupChats,
        setGroupChats: setGroupChats,
        currentChatRoom: currentChatRoom,
        setCurrentChatRoom: setCurrentChatRoom
    };

    return (
        <ChatAppContext.Provider value={value}>
            {children}
        </ChatAppContext.Provider>
    )
}