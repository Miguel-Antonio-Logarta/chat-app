import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatAppContext";
import { useSocket } from "../../context/SocketContext";
import ProfileImage from "../ProfileImage";

type FriendProps = {
  id: number;
  username: string;
  description: string;
  online: boolean;
  roomId: number;
};

const Friend = (props: FriendProps) => {
  const { sendMessage } = useSocket();
  const { username } = useAuth();
  const { currentChatRoom } = useChat();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (props.roomId) {
      sendMessage("GET_MESSAGES", { roomId: props.roomId });
      sendMessage("GET_ROOM_INFO", { roomId: props.roomId });
    } else {
      alert(`Direct Message between ${username} and ${props.username} does not exist!`);
    }
  };

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
        <p>{props.description}@##:##</p>
      </div>
    </div>
  );
};

export default Friend;
