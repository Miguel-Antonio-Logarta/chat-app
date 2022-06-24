import React, { useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";

type MessageListProps = {

};

type MessageProps = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
};

type MessageItem = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

const Message = ({id, username, message, timestamp}: MessageProps) => {
  return (
    <div className="message">
      <div className="profile-picture"></div>
      <p className="username">{username} Id: {id}</p>
      <div className="message-content">
        <p>{message}</p>
      </div>
      <p className="timestamp">Sent: {timestamp}</p>
    </div>
  )
};

const MessageList = (props: MessageListProps) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const { socket } = useSocketContext();

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
        setMessages(evt.payload);
      }
    })
  }, [messages, socket])

  return (
    <div className="chat-messages">
      <div className="messages-list">
        {messages.map(message => <Message key={message.id} id={message.id} username={message.username} message={message.message} timestamp={message.timestamp} />)}
      </div>
    </div>
  );
};

export default MessageList;
