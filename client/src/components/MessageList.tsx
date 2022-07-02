import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import SendMessage from "./SendMessage";
import { useSocketContext } from "./SocketContext";
import dayjs from 'dayjs' // ES 2015

type MessageListProps = {

};

type MessageProps = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  placeRight: boolean;
  lastTimestamp: string | null;
  lastUsername: string;
};

type MessageItem = {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

type TimestampSeparatorProps = {
  timestamp: string;
  lastTimestamp: string | null;
}

// Rename to "readTimeDifference" and return obj {className: str, readableTime: str}
const findSpacing = (currentTimeStamp: string, lastMsgTimestamp: string | null, username: string, lastUsername: string): string => {
  const MINUTE = 60000
  const currentTime = dayjs(currentTimeStamp);
  const lastTime = dayjs(lastMsgTimestamp);
  const timeDifference = currentTime.diff(lastTime)

  if (lastMsgTimestamp && username === lastUsername && timeDifference < MINUTE) {
    return "small-msg-margin";
  }
  else {
    return "medium-msg-margin";
  }
}

// const displayTime
const TimestampSeparator = ({lastTimestamp, timestamp}: TimestampSeparatorProps) => {
  // If message is from today, and last timestamp is from today, then reteurn null
  // If message is from today, and last timestamp is from yesterday, then return "--today, date--"
  // If message is not from today, and last timestamp is from the same day, return null
  // If message is not from today, and last timestamp is not from the same day, return "--date--"
  const currentMsgTime = dayjs(timestamp);
  const lastMsgTime = dayjs(lastTimestamp);
  let readableDate = "";
  // if (lastMsgTime.isSame(dayjs(), )

  if (currentMsgTime.isSame(dayjs(), 'day')) {
    if (lastMsgTime.isSame(dayjs(), 'day')) {
      return null;
    } 
    else {
      readableDate = 'Today, ' + currentMsgTime.format('MMMM D');
    }
  }
  else {
    if (lastMsgTime.isSame(currentMsgTime, 'day')) {
      return null;
    } 
    else {
      readableDate = currentMsgTime.format('dddd, MMMM D, YYYY');
    }
  }

  return (
    <div className="timestamp-separator">
      {readableDate}
    </div>
  );
}

const Message = ({id, username, message, timestamp, placeRight, lastTimestamp, lastUsername}: MessageProps) => {
  const spacingType = findSpacing(timestamp, lastTimestamp, username, lastUsername);
  const readableTime = dayjs(timestamp).format("h:mm A");
  
  return (
    <>
      <TimestampSeparator timestamp={timestamp} lastTimestamp={lastTimestamp} />
      <div className={`message ${placeRight && `owner`} ${spacingType}`}>
        <div className="profile-picture"></div>
        <p className="username">{username}</p>
        {spacingType !== "small-msg-margin" && <p className="timestamp">sent: {readableTime}</p>}
        <div className="message-content">
          <p>{message}</p>
        </div>
      </div>
    </>
  )
};

const MessageList = (props: MessageListProps) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [roomName, setRoomName] = useState<string>("");
  const { username } = useAuth();
  const { socket, currentRoom, setCurrentRoom } = useSocketContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    // messagesEndRef.current?.scrollIntoView()
  }

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

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  return (
    <div className="chat-messages">
      <div className="messages-list">
        <div className="chat-name">
          {messages.length > 0 ? <h2>{roomName}</h2> : <h2>Chat Room</h2>}
        </div>
        {/* Group Messages together. If previous message was sent less than one minute apart, put a small margin between */}
        {/* If previous message was sent more than one minute apart, put a medium margin between with timestamp and pfp showing on each bubble */}
        {/* If previous message was from another day, insert a timestamp separator in between */}
        {!messages.length && 
          <div className="chat-empty-prompt">
              Select a chat room to start talking...
          </div>
        }
        {messages.map((message, index, array) => 
          <Message 
          key={message.id} 
          id={message.id} 
          username={message.username} 
          message={message.message} 
          timestamp={message.timestamp} 
          placeRight={message.username === username}
          lastTimestamp={array[index-1] ? array[index-1].timestamp : null}
          lastUsername={array[index-1] ? array[index-1].username : ""}
          />)
        }
        <div ref={messagesEndRef} />
      </div>
      <SendMessage />
    </div>
  );
};

export default MessageList;
