import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SendMessage from "./SendMessage";
import Message from "./Message";
import { useChat } from "../../context/ChatAppContext";
import { useSocket } from "../../context/SocketContext";

type MessageListProps = {};

type MessageItem = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
};

const MessageList = (props: MessageListProps) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  // const [roomName, setRoomName] = useState<string>("");
  const { username } = useAuth();
  // const { socket, isConnected, currentRoom } = useSocketContext();
  const { currentChatRoom } = useChat();
  const { on, off, sendMessage } = useSocket();
  // const [scrollSmoothly, setScrollSmoothly] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth: boolean) => {
    if (smooth) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    else {
      messagesEndRef.current?.scrollIntoView();
    }
  };

  useEffect(() => {
    const addMessage = (payload: any) => {
      setMessages((messages: any) => [
        ...messages,
        {
          id: payload.id,
          username: payload.username,
          message: payload.message,
          timestamp: payload.timestamp,
        },
      ])
    };

    const handleGettingMessages = (payload: any) => {
      setMessages((messages: any) => payload.messages);
    }

    on("SEND_MESSAGE", addMessage)
    on("GET_MESSAGES", handleGettingMessages)

    return () => {
      off("SEND_MESSAGE", addMessage)
      off("GET_MESSAGES", handleGettingMessages)
    }
  }, [on, off])

  useEffect(() => {
    // TODO: Check if previous state messages was empty.
    // scrollToBottom();
    // setScrollSmoothly(false);
    scrollToBottom(false);
  }, [messages]);

  return (
    <div className="chat-messages">
      <div className="messages-list">
        <div className="chat-name">
          {messages.length > 0 ? <h2>{currentChatRoom?.roomName}</h2> : <h2>Chat Room</h2>}
        </div>
        {/* Group Messages together. If previous message was sent less than one minute apart, put a small margin between */}
        {/* If previous message was sent more than one minute apart, put a medium margin between with timestamp and pfp showing on each bubble */}
        {/* If previous message was from another day, insert a timestamp separator in between */}
        {currentChatRoom == null && (
          <div className="chat-empty-prompt">
            Select a chat room to start talking...
          </div>
        )}
        {currentChatRoom != null && messages.map((message, index, array) => (
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
