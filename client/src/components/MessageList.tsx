import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import SendMessage from "./SendMessage";
import { useSocketContext } from "./SocketContext";
import Message from "./Message";

type MessageListProps = {};

type MessageItem = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
};

const MessageList = (props: MessageListProps) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const { username } = useAuth();
  const { socket, isConnected } = useSocketContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth: boolean) => {
    if (smooth) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (isConnected) {
      socket.addEventListener("message", (event) => {
        const evt = JSON.parse(event.data);
        if (evt.type === "SEND_MESSAGE") {
          setMessages([
            ...messages,
            {
              id: evt.payload.id,
              username: evt.payload.username,
              message: evt.payload.message,
              timestamp: evt.payload.timestamp,
            },
          ]);
        } else if (evt.type === "GET_MESSAGES") {
          setMessages(evt.payload.messages);
          setRoomName(evt.payload.room_name);
          // scrollToBottom(false);
        }
      });
    }
  }, [messages, socket, isConnected]);

  useEffect(() => {
    // TODO: Check if previous state messages was empty.
    scrollToBottom(true);
  }, [messages]);

  return (
    <div className="chat-messages">
      <div className="messages-list">
        <div className="chat-name">
          {messages.length > 0 ? <h2>{roomName}</h2> : <h2>Chat Room</h2>}
        </div>
        {/* Group Messages together. If previous message was sent less than one minute apart, put a small margin between */}
        {/* If previous message was sent more than one minute apart, put a medium margin between with timestamp and pfp showing on each bubble */}
        {/* If previous message was from another day, insert a timestamp separator in between */}
        {!messages.length && (
          <div className="chat-empty-prompt">
            Select a chat room to start talking...
          </div>
        )}
        {messages.map((message, index, array) => (
          <Message
            key={message.id}
            id={message.id}
            username={message.username}
            message={message.message}
            timestamp={message.timestamp}
            placeRight={message.username === username}
            lastTimestamp={array[index - 1] ? array[index - 1].timestamp : null}
            lastUsername={array[index - 1] ? array[index - 1].username : ""}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <SendMessage />
    </div>
  );
};

export default MessageList;
