import { createContext, useContext, useEffect, useState } from "react";
import { Friend, FriendRequest, GroupChat } from "../types";
import { useSocket } from "./SocketContext";

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
    const { on, off, sendMessage, socket } = useSocket();

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

    // Handles group chats
    useEffect(() => {
        const handleGroupChats = (payload: GroupChat[]) => {
            console.log("Group Chats", payload);
            setGroupChats(payload);
        }

        const handleCreateGroupChat = (payload: any) => {
            setGroupChats((groupChats: GroupChat[]) => [
                ...groupChats, 
                {
                    roomId: payload.roomId,
                    name: payload.name,
                    isGroupChat: payload.isGroupChat,
                    createdOn: payload.createdOn
                }
            ])
        }

        const handleLeaveGroupChat = (payload: any) => {
            setCurrentChatRoom(null);
            setGroupChats((groupChats: GroupChat[]) => 
                groupChats.filter((room: any) => room.roomId !== payload.roomId)
            );
        }

        const handleConfirmJoinGroupChat = (payload: any) => {
            setGroupChats((groupChats: GroupChat[]) => [
                ...groupChats, 
                {
                    roomId: payload.roomId,
                    name: payload.name,
                    isGroupChat: payload.isGroupChat,
                    createdOn: payload.createdOn
                }
            ])
        }

        const handleInvitedToGroupChat = (payload: any) => {
            setGroupChats((groupChats: GroupChat[]) => [
                ...groupChats, 
                {
                    roomId: payload.roomId,
                    name: payload.name,
                    isGroupChat: payload.isGroupChat,
                    createdOn: payload.createdOn
                }
            ])
        }

        on("GET_GROUP_CHATS", handleGroupChats);
        // on("LEAVE_ROOM", handleLeaveRoom); <- we don't need this anymore
        on("CREATE_GROUP_CHAT", handleCreateGroupChat);
        on("CONFIRM_JOIN_GROUP_CHAT", handleConfirmJoinGroupChat);
        on("LEAVE_GROUP_CHAT", handleLeaveGroupChat);
        // on("INVITED_TO_GROUP_CHAT", handleInvitedToGroupChat); <-- Re-add these asap
        // on("INVITE_TO_GROUP_CHAT",) <- Only adds a new member to a group chat
        // on("GET_ROOM_INFO",)
        // on("JOIN_GROUP_CHAT",) <- this only grabs info, and doesn't change state of group chats

        return () => {
            off("GET_GROUP_CHATS", handleGroupChats);
            off("CREATE_GROUP_CHAT", handleCreateGroupChat);
            off("LEAVE_GROUP_CHAT", handleLeaveGroupChat);
            // off("CONFIRM_JOIN_GROUP_CHAT", handleConfirmJoinGroupChat); <-- Re-add these asap
            // off("INVITED_TO_GROUP_CHAT", handleInvitedToGroupChat); <-- Re-add these asap
        }
    }, [sendMessage, on, off])

    // Handles friends and friend requests
    useEffect(() => {
        const handleGetFriends = (payload: Friend[]) => {
            console.log("Friends", payload);
            setFriends(payload);
        }

        const handleGetFriendRequests = (payload: FriendRequest[]) => {
            console.log("Friend Requests", payload);
            setFriendRequests(payload);
        }

        const handleAcceptFriendRequest = (payload: any) => {
            // Add new friend
            setFriends((friends) => [
                ...friends,
                {
                    userId: payload.friendId,
                    username: payload.friendUsername,
                    roomId: payload.roomId
                }
            ])

            // Remove friend request since it has now been accepted.
            // This should handled in the friend request component
            setFriendRequests((friendRequests: FriendRequest[]) => 
                friendRequests.filter((friendRequest: FriendRequest) => friendRequest.userId !== payload.friendId));
        }

        const handleReceiveFriendRequest = (payload: any) => {
            setFriendRequests((friendRequests: FriendRequest[]) => [
                ...friendRequests,
                {
                    userId: payload.id,
                    username: payload.username,
                    createdOn: payload.createdOn
                }
            ])
        }

        on("GET_FRIENDS", handleGetFriends);
        on("GET_FRIEND_REQUESTS", handleGetFriendRequests);
        on("ACCEPT_FRIEND_REQUEST", handleAcceptFriendRequest);
        // on("RECEIVE_FRIEND_REQUEST", handleReceiveFriendRequest); <-- Re-add these asap
        // on("CREATE_FRIEND_CHAT",)

    
      return () => {
        off("GET_FRIENDS", handleGetFriends);
        off("GET_FRIEND_REQUESTS", handleGetFriendRequests);
        off("ACCEPT_FRIEND_REQUEST", handleAcceptFriendRequest);
        // off("RECEIVE_FRIEND_REQUEST", handleReceiveFriendRequest); <-- Re-add these asap
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