import React, { useState } from "react";
import { MdClose, MdContentCopy, MdSearch } from "react-icons/md";
import Modal from "./Modal";
import {friends} from "../data/testData";

type Props = {
  showSelf: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
  roomId: number;
};

type InviteFriendItemProps = {
  id: number;
  username: string;
}

const InviteFriendItem = (props: InviteFriendItemProps) => {
  return (
    <div className="friend-invite">
      <div className="circle"></div>
      <p>{props.username}</p>
      <button>Invite</button>
    </div>
  )
}
const InviteGroupMembers = ({ showSelf, ...props }: Props) => {
  const [currentSearch, setCurrentSearch] = useState("");

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    setCurrentSearch(search);
  }

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    showSelf(false);
  };

  return (
    <Modal onClose={handleClose}>
      <div onMouseDown={(e) => e.stopPropagation()} className="invite-members-background">
        <button onClick={handleClose} className="close">
          <MdClose />
        </button>
        <div className="invite-members">
          <h2 className="thin-yellow-font">Invite Members to {props.roomName}</h2>
          <div className="search-invite-friends">
            <input onChange={handleChange} autoComplete="off" placeholder="Search by Username"/>
            <MdSearch />
          </div>
          <div className="friends-invite-list">
            {friends
              .filter((friend) => (currentSearch === "") || (friend.username.startsWith(currentSearch)))
              .map((friend) => 
              <InviteFriendItem 
                key={friend.id} 
                id={friend.id} 
                username={friend.username} />
            )}
          </div>
          <p>Or send them the room ID</p>
          <div className="room-id-copy">
            {/* <p>{props.roomId}</p> */}
            <input onFocus={handleFocus} value={props.roomId} readOnly/>
            <button title="Copy ID" onClick={() => {navigator.clipboard.writeText(props.roomId.toString())}}>
              <MdContentCopy />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InviteGroupMembers;
