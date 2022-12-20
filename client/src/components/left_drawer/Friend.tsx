import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

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
    <div onClick={handleClick} className="friend-overview">
      <div
        className={`friend-icon ${props.online ? "online" : "offline"}`}
      >
        {/* ${process.env.PUBLIC_URL}/assets/images/uc-white.png */}
        <img src={require(`../../assets/images/a3sdlkfjadf.png`)} alt={props.username} />
      </div>
      <div className="friend-info">
        <h4>{props.username}</h4>
        <p>{props.description}@##:##</p>
      </div>
    </div>
  );
};

export default Friend;
