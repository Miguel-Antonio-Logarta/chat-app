import React from "react";
import { useBetterSocket } from "../../context/BetterSocketContext";

type FriendProps = {
  id: number;
  username: string;
  description: string;
  online: boolean;
  roomId: number;
};

const Friend = (props: FriendProps) => {
  const { sendMessage } = useBetterSocket();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    sendMessage("GET_MESSAGES", { roomId: props.roomId });
    sendMessage("GET_ROOM_INFO", { roomId: props.roomId });
  };

  return (
    <div onClick={handleClick} className="friend-overview">
      <div
        className={`friend-icon ${props.online ? "online" : "offline"}`}
      ></div>
      <div className="friend-info">
        <h4>{props.username}</h4>
        <p>{props.description}@##:##</p>
      </div>
    </div>
  );
};

export default Friend;
