import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import SendMessage from "./SendMessage";
import { useSocketContext } from "./SocketContext";

type MessageListProps = {

};

type MessageProps = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  placeRight: boolean;
};

type MessageItem = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

const Message = ({id, username, message, timestamp, placeRight}: MessageProps) => {
  return (
    <div className={`message ${placeRight && `owner`}`}>
      <div className="profile-picture"></div>
      <p className="username">{username}</p>
      <div className="message-content">
        <p>{message}</p>
      </div>
      <p className="timestamp">Sent: {timestamp}</p>
    </div>
  )
};

const MessageList = (props: MessageListProps) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const { username } = useAuth();
  const { socket, currentRoom, setCurrentRoom } = useSocketContext();

  useEffect(() => {
    socket.addEventListener('open', (event) => {
      socket.send(JSON.stringify({
        type: "GET_MESSAGES",
        payload: ""
      }))
    })

    socket.addEventListener('message', (event) => {
      const evt = JSON.parse(event.data); 
      if (evt.type === "SEND_MESSAGE") {
        setMessages([
          ...messages,
          {
            id: evt.payload.id,
            username: evt.payload.username,
            message: evt.payload.message,
            timestamp: evt.payload.timestamp
          }
        ]);
      } else if (evt.type === "GET_MESSAGES") {
        console.log(evt.payload);
        // We have to make sure that our current room is matching evt.payload.room_id
        setMessages(evt.payload.messages);
        setCurrentRoom(evt.payload.room_id);
        setRoomName(evt.payload.room_name);
      }
    })
  }, [messages, socket, setCurrentRoom])

  return (
    <div className="chat-messages">
      <div className="messages-list">
        <div className="chat-name">
          <h2>{roomName}</h2>
        </div>
        {/* Group Messages together. If previous message was sent less than one minute apart, put a 2px margin apart */}
        {/* If previous message was sent more than 2 minutes apart, put a 4px margin apart with timestamp */}
        {/* If previous message was more than an hour apart, put a --today at xx:xx PM / AM-- timestamp on top of message to indicate new conversation */}
        {messages.map(message => 
          <Message 
          key={message.id} 
          id={message.id} 
          username={message.username} 
          message={message.message} 
          timestamp={message.timestamp} 
          placeRight={message.username === username}/>)
        }
      </div>
      <SendMessage />
    </div>
  );
};

export default MessageList;
