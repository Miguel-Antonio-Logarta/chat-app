import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatAppContext";
import { useSocket } from "../../context/SocketContext";
import ProfileImage from "../ProfileImage";
import dayjs from 'dayjs';

type FriendProps = {
  id: number;
  username: string;
  description: string;
  online: boolean;
  roomId: number;
};

const Friend = (props: FriendProps) => {
  const { sendMessage, on, off } = useSocket();
  const { username } = useAuth();
  const { currentChatRoom } = useChat();
  const [latestMessage, setLatestMessage] = useState<any>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (props.roomId) {
      sendMessage("GET_MESSAGES", { roomId: props.roomId });
      sendMessage("GET_ROOM_INFO", { roomId: props.roomId });
    } else {
      alert(`Direct Message between ${username} and ${props.username} does not exist!`);
    }
  };

  useEffect(() => {
    sendMessage("GET_LATEST_MESSAGES", {
      roomId: props.roomId,
      noOfMessages: 1
    })
  }, [props.roomId, sendMessage]);

  useEffect(() => {
    const getLatestMessage = (payload: any) => {
      console.log(payload);
      // setLatestMessage((message: any) => payload.messages[0] ? payload.messages[0] : null);
      setLatestMessage((message: any) => {
        if (payload.roomId === props.roomId && payload.messages[0]) {
          return payload.messages[0];
        } else {
          return message;
        }
      });
    }

    on("GET_LATEST_MESSAGES", getLatestMessage);

    return () => {
      off("GET_LATEST_MESSAGES", getLatestMessage);
    }
  }, [on, off, props.roomId])

  return (
    <div onClick={handleClick} className={`friend-overview ${currentChatRoom?.roomId === props.roomId ? "active" : ""}`}>
      <div
        className={`friend-icon ${props.online ? "online" : "offline"}`}
      >
        {/* <img src={`${process.env.REACT_APP_S3_BASE_OBJECT_URL}${process.env.REACT_APP_S3_PROFILE_IMAGES_LOCATION}${props.id}`} alt={props.username} /> */}
        <ProfileImage id={props.id} username={props.username}/>
      </div>
      <div className="friend-info">
        <h4>{props.username}</h4>
        {latestMessage && <p>{`${latestMessage.message} @ ${dayjs(latestMessage.timestamp).format('DD/MM/YYYY')}`}</p>}
        {/* <p>{props.description}@##:##</p> */}
      </div>
    </div>
  );
};

export default Friend;
