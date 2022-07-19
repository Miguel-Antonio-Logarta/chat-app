import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import AddFriend from "./AddFriend";
import { friends } from "../../data/testData"
import { MdCheck, MdClose } from "react-icons/md";

type Props = {};
type FriendRequestItemProps = {
  username: string;
  userId: number;
};

const FriendRequestItem = (props: FriendRequestItemProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  return (
    <div onClick={handleClick} className='friend-request-item'>
      <div className='circle'></div>
      <h4>{props.username}</h4>
      <button title="Accept friend request" className="accept-friend"><MdCheck /></button>  
      <button title="Reject friend request" className="reject-friend"><MdClose /></button>  
    </div>
  );
}

const FriendRequests = (props: Props) => {
  const [addFriend, setAddFriend] = useState(false);

  return (
    <>
      {addFriend && <AddFriend showSelf={setAddFriend} />}
      <div className="upper-chat-list">
        <h2>My Friend Requests</h2>
        <button onClick={() => setAddFriend(true)}>
          <AiOutlinePlus />
        </button>
      </div>
      <div className="friend-request-list">
        {friends.map((friend) => 
          <FriendRequestItem key={friend.id} username={friend.username} userId={friend.id}/>
        )}
      </div>
    </>
  );
};

export default FriendRequests;
