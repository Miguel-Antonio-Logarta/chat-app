import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useSocketContext } from "./SocketContext";

type MessageListProps = {

};

type MessageProps = {
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

const Message = ({username, message, timestamp}: MessageProps) => {
  return (
    <div className="message">
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
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 1,
      username: "dawg",
      message: "whenamechainasama",
      timestamp: "5:55"
    },
    {
      id: 2,
      username: "cattor",
      message: "tilmyhatbizsaund",
      timestamp: "6:00"
    }
  ]);
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("sent_message", (msg: MessageItem) => {
      console.log(msg);
      setMessages([
        ...messages,
        msg
      ]);
    })
  }, [messages, socket])

  return (
    <div className="chat-messages">
      <div className="messages-list">
        {messages.map(message => <Message key={message.id} username={message.username} message={message.message} timestamp={message.timestamp}/>)}
        {/* <div className="message">
          <div className="profile-picture"></div>
          <p className="username">Kiwilover</p>
          <div className="message-content">
            <p>lorem ipsum blah blah blah</p>
          </div>
          <p className="timestamp">Sent: 6:49PM</p>
        </div>
        <div className="message owner">
          <div className="profile-picture"></div>
          <p className="username">__ILoveKiwis__ &#40;You&#41;</p>
          <p className="timestamp">Sent: 7:00PM</p>
          <div className="message-content">
            <p>
              The fitness gram pacer test is an aerobic capacity test
              dfa;kldjsf;klasjdfl;kajsdfkl;jasdl;kfjl;aksdjf;klasjdfl;kasjdfl;kjasdfkl;jasdl;kfjasdl;kfjal;skdfja;lksdjf;laksjdf;lkajsdf;lkajsdfl;aj
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default MessageList;
