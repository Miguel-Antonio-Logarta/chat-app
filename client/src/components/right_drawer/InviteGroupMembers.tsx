import React, { useEffect, useState } from "react";
import { MdClose, MdContentCopy, MdSearch } from "react-icons/md";
import { useChat } from "../../context/ChatAppContext";
import {friends} from "../../data/testData";
import Modal from "../Modal";

type Props = {
  showSelf: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
  roomId: number;
};

type InviteFriendItemProps = {
  id: number;
  username: string;
}

type FriendType = {
  userId: number;
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
  const { friends, currentChatRoom } = useChat();
  const [canInvite, setCanInvite] = useState<FriendType[]>([]);
  
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

  useEffect(() => {
    const getPotentialInvites = () => {
      if (currentChatRoom) {
        const allMembers = [...currentChatRoom.onlineUsers, ...currentChatRoom.offlineUsers];
        console.log("members", allMembers);
        // Can invite includes friends that are not in the group chat
        console.log("friends", friends);
        const canInvite = friends.filter((friend) => allMembers.some((already_invited) => already_invited.userId === friend.userId ));
        console.log("can invite", canInvite);
        return canInvite;
      } else {
        return [];
      }
    }

    setCanInvite(getPotentialInvites());
  }, [currentChatRoom, friends])

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
            {canInvite
              .filter((friend) => (currentSearch === "") || (friend.username.startsWith(currentSearch)))
              .map((friend) => 
              <InviteFriendItem 
                key={friend.userId} 
                id={friend.userId} 
                username={friend.username} />
            )}
          </div>
          <p>Or send them the room ID</p>
          <div className="room-id-copy">
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
