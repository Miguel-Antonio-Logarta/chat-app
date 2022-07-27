import React from "react";

type InviteFriendItemProps = {
  id: number;
  username: string;
};

const InviteFriendItem = (props: InviteFriendItemProps) => {
  return (
    <div className="friend-invite">
      <div className="circle"></div>
      <p>{props.username}</p>
      <button>Invite</button>
    </div>
  );
};

export default InviteFriendItem;
