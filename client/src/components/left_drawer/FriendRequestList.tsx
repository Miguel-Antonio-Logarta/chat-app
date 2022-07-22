import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import AddFriend from "./AddFriend";
import FriendRequest from "./FriendRequest";
import { useChat } from "../../context/ChatAppContext";

type Props = {};

const FriendRequestList = (props: Props) => {
  const { friendRequests, setFriendRequests } = useChat();
  const [addFriend, setAddFriend] = useState(false);

  const deleteFriendRequest = (userId: number) => {
    setFriendRequests(friendRequests.filter((friend) => friend.userId !== userId));
  }

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
        {friendRequests.map((friend) => 
          <FriendRequest key={friend.userId} username={friend.username} userId={friend.userId} deleteSelf={deleteFriendRequest}/>
        )}
      </div>
    </>
  );
};

export default FriendRequestList;
