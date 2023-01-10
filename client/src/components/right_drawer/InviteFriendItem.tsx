import React from "react";
import ProfileImage from "../ProfileImage";

type InviteFriendItemProps = {
  id: number;
  username: string;
};

const InviteFriendItem = (props: InviteFriendItemProps) => {
  return (
    <div className="friend-invite">
      {/* <div className="circle"></div> */}
      <ProfileImage className="circle" username={props.username} id={props.id} />
      <p>{props.username}</p>
      <button>Invite</button>
    </div>
  );
};

export default InviteFriendItem;
