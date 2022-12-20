import React, { useEffect } from "react";
import { useChat } from "../../context/ChatAppContext";
// import { friends } from "../../data/testData";
import Friend from "./Friend";

type Props = {};

const FriendList = (props: Props) => {
  // const {on, off} = useBetterSocket();
  const { friends } = useChat();
  
  // useEffect(() => {
  //   const handleNewFriend = (payload: any) => {
  //     console.log("I got a new friend!");
  //     setFriends((friends) => [
  //       ...friends,
  //       {
  //         userId: payload.friendId,
  //         username: payload.friendUsername,
  //         roomId: payload.roomId
  //       }
  //     ])
  //   }

  //   on("ACCEPT_FRIEND_REQUEST", handleNewFriend);

  //   return () => {
  //     off("ACCEPT_FRIEND_REQUEST", handleNewFriend);
  //   }
  // }, [on, off, setFriends])

  return (
    <>
      <div className="upper-chat-list">
        <h2>My Friends</h2>
      </div>
      <div className="friend-list">
        {friends.map((friend) => 
          <Friend 
            key={friend.userId} 
            id={friend.userId} 
            username={friend.username}
            description="Last Message Here" 
            roomId={friend.roomId}
            online={true} />
        )}
      </div>
    </>
  );
};

export default FriendList;
