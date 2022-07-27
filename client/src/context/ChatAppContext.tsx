import { createContext, useContext, useEffect, useState } from "react";
import { Friend, FriendRequest, GroupChat } from "../types";
import { useBetterSocket } from "./BetterSocketContext";

type ChatAppContextProviderProps = {
    children?: React.ReactNode;
}

type ChatAppContextType = {
    groupChats: GroupChat[];
    friends: Friend[];
    friendRequests: FriendRequest[];
    setGroupChats: React.Dispatch<React.SetStateAction<GroupChat[]>>;
    setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
    setFriendRequests: React.Dispatch<React.SetStateAction<FriendRequest[]>>;
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
    onlineUsers: UserInfoType[];
    offlineUsers: UserInfoType[];
}

export const ChatAppContext = createContext<ChatAppContextType>(null!);
export const useChat = () => useContext(ChatAppContext);
export const ChatAppContextProvider = ({children}: ChatAppContextProviderProps) => {
    // Holds the global state and handles authentication and web socket
    const { on, off, sendMessage, socket } = useBetterSocket();

    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
    const [currentChatRoom, setCurrentChatRoom] = useState<CurrentChatRoomType | null>(null);

    useEffect(() => {
        // Hydrate state by getting group chats, friends, and friend requests
        socket.addEventListener('open', (event) => {
            sendMessage("GET_GROUP_CHATS", {});
            sendMessage("GET_FRIENDS", {});
            sendMessage("GET_FRIEND_REQUESTS", {});
        })
    }, [socket, sendMessage]);

    useEffect(() => {
        // TODO: Add listeners for updates to group chats, friends, and friend requests (ex: Someone rejects/accepts your friend request or you get invited to a group chat)
        const handleGroupChats = (payload: GroupChat[]) => {
            console.log("Group Chats", payload);
            setGroupChats(payload);
        }

        const handleGetFriends = (payload: Friend[]) => {
            console.log("Friends", payload);
            setFriends(payload);
        }

        const handleGetFriendRequests = (payload: FriendRequest[]) => {
            console.log("Friend Requests", payload);
            setFriendRequests(payload);
        }

        const handleLeaveRoom = (payload: any) => {
            setGroupChats((groupChats: any) => 
                groupChats.filter((room: any) => room.roomId !== payload.roomId)
            );
        }

        const handleNewFriend = (payload: any) => {
            setFriends((friends) => [
              ...friends,
              {
                userId: payload.friendId,
                username: payload.friendUsername,
                roomId: payload.roomId
              }
            ])
          }

        on("GET_GROUP_CHATS", handleGroupChats);
        on("GET_FRIENDS", handleGetFriends);
        on("GET_FRIEND_REQUESTS", handleGetFriendRequests);
        on("LEAVE_ROOM", handleLeaveRoom);
        on("ACCEPT_FRIEND_REQUEST", handleNewFriend);
        
        return () => {
            off("GET_GROUP_CHATS", handleGroupChats);
            off("GET_FRIENDS", handleGetFriends);
            off("GET_FRIEND_REQUESTS", handleGetFriendRequests);
            off("LEAVE_ROOM", handleLeaveRoom);
            off("ACCEPT_FRIEND_REQUEST", handleNewFriend);
        }
    }, [sendMessage, on, off])

    const value = {
        groupChats: groupChats,
        friends: friends,
        friendRequests: friendRequests,
        setGroupChats: setGroupChats,
        currentChatRoom: currentChatRoom,
        setCurrentChatRoom: setCurrentChatRoom,
        setFriends: setFriends,
        setFriendRequests: setFriendRequests
    };

    return (
        <ChatAppContext.Provider value={value}>
            {children}
        </ChatAppContext.Provider>
    )
}