import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { friends } from "../data/testData";

type Props = {};
type FriendProps = {
  id: number;
  username: string;
  description: string;
  online: boolean;
};

const Friend = (props: FriendProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  return (
    <div onClick={handleClick} className='friend-overview'>
      <div className={`friend-icon ${props.online ? "online" : "offline"}`}></div>
      <div className='friend-info'>
        <h4>{props.username}</h4>
        <p>{props.description}@##:##</p>
      </div>
    </div>
  );
}

const FriendList = (props: Props) => {
  return (
    <>
      <div className="upper-chat-list">
        <h2>My Friends</h2>
        {/* <button>
          <AiOutlinePlus />
        </button> */}
      </div>
      <div className="friend-list">
        {friends.map((friend) => 
          <Friend 
            key={friend.id} 
            id={friend.id} 
            username={friend.username}
            description="Last Message Here" 
            online={true} />
        )}
      </div>
      {/* <div className="select-group-chat">
            {rooms.map((room) => <GroupChatItem
              key={room.roomId}
              roomId={room.roomId}
              roomName={room.name}
              isGroupChat={room.isGroupChat}
              createdOn={room.createdOn}
              description={"last message goes here "}
              />)
            }
          </div> */}
    </>
  );
};

export default FriendList;
