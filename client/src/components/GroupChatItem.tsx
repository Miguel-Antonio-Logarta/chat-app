import React, { useEffect, useState } from 'react'
import { useSocketContext } from "./SocketContext";


type GroupChatItemProps = {
    roomId: number;
    roomName: string;
    description: string;
    createdOn: string;
    isGroupChat: boolean;
  }

const GroupChatItem = (props: GroupChatItemProps) => {
    const { socket, isConnected } = useSocketContext();
  
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (socket && isConnected) {
        socket.send(JSON.stringify({
          type: "GET_MESSAGES",
          payload: {
            room_id: props.roomId
          }
        }))
      }
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