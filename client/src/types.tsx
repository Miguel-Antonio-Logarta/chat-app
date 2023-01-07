export type MessagesResponse = {
    id: number;
    username: string;
    message: string;
    timestamp: string;
};

export type GroupChatResponseItem = {

}

export type GroupChat = {
    roomId: number;
    name: string;
    isGroupChat: boolean;
    createdOn: string;
}

export type Friend = {
    userId: number;
    username: string;
    roomId: number;
}

export type FriendRequest = {
    userId: number;
    username: string;
    createdOn: string;
}

export type SendMessage = {
    type: string;
    payload: unknown;
}

export type GetLatestMessage = {
    room_id: string;
    no_of_messages: number; 
}

export enum Events {
    SEND_MESSAGE = "SEND_MESSAGE",
    GET_MESSAGES = "GET_MESSAGES",
    CREATE_GROUP_CHAT = "CREATE_GROUP_CHAT",
    LEAVE_GROUP_CHAT = "LEAVE_GROUP_CHAT",
    GET_ROOMS = "GET_ROOMS",
    GET_ROOM_INFO = "GET_ROOM_INFO",
    GET_GROUP_CHATS = "GET_GROUP_CHATS",
    JOIN_GROUP_CHAT = "JOIN_GROUP_CHAT",
    CONFIRM_JOIN_GROUP_CHAT = "CONFIRM_JOIN_GROUP_CHAT",
    INVITE_TO_GROUP_CHAT = "INVITE_TO_GROUP_CHAT",
    GET_FRIENDS = "GET_FRIENDS",
    GET_FRIEND_REQUESTS = "GET_FRIEND_REQUESTS",
    SEND_FRIEND_REQUEST = "SEND_FRIEND_REQUEST",
    CONFIRM_SEND_FRIEND_REQUEST = "CONFIRM_SEND_FRIEND_REQUEST",
    ACCEPT_FRIEND_REQUEST = "ACCEPT_FRIEND_REQUEST",
    REJECT_FRIEND_REQUEST = "REJECT_FRIEND_REQUEST",
    GET_LATEST_MESSAGES = "GET_LATEST_MESSAGES",
}

export type EventTypes = keyof typeof Events;