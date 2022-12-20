import React from "react";
import { MdCheck, MdClose } from "react-icons/md";
import { useSocket } from "../../context/SocketContext";

type FriendRequestItemProps = {
  username: string;
  userId: number;
  deleteSelf: (userId: number) => void;
};

const FriendRequest = (props: FriendRequestItemProps) => {
  const { sendMessage } = useSocket();
  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendMessage("ACCEPT_FRIEND_REQUEST", { friend_id: props.userId });
    props.deleteSelf(props.userId);
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendMessage("REJECT_FRIEND_REQUEST", { friend_id: props.userId });
    props.deleteSelf(props.userId);
  };

  return (
    <div className="friend-request-item">
      <div className="circle"></div>
      <h4>{props.username}</h4>
      <button
        onClick={handleAccept}
        title="Accept friend request"
        className="accept-friend"
      >
        <MdCheck />
      </button>
      <button
        onClick={handleReject}
        title="Reject friend request"
        className="reject-friend"
      >
        <MdClose />
      </button>
    </div>
  );
};

export default FriendRequest;
