import React from "react";
import { MdCheck, MdClose } from "react-icons/md";
import { useSocket } from "../../context/SocketContext";
import ProfileImage from "../ProfileImage";

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
      {/* <div className="circle">
        <img className="profile-picture" src={`${process.env.REACT_APP_S3_BASE_OBJECT_URL}${process.env.REACT_APP_S3_PROFILE_IMAGES_LOCATION}${props.userId}.png`} alt={props.username}/>
      </div> */}
      <ProfileImage id={props.userId} username={props.username} className="profile-picture"/>
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
