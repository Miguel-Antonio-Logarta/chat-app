import React from 'react'
import { useSocket } from '../../context/SocketContext';


type GroupChatItemProps = {
    roomId: number;
    roomName: string;
    description: string;
    createdOn: string;
    isGroupChat: boolean;
  }

const GroupChatItem = (props: GroupChatItemProps) => {
    const { sendMessage } = useSocket();
  
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      sendMessage("GET_MESSAGES", {roomId: props.roomId});
      sendMessage("GET_ROOM_INFO", {roomId: props.roomId});
    }
    
    
    return (
      <div onClick={handleClick} className='server-overview'>
        <div className='server-icon'></div>
        <div className='server-info'>
          <h4>{props.roomName}</h4>
          <p>{props.description}@##:##</p>
        </div>
      </div>
    )
  }

  export default GroupChatItem;