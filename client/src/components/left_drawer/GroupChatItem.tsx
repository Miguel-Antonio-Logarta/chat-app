import React from 'react'
import { useChat } from '../../context/ChatAppContext';
import { useSocket } from '../../context/SocketContext';
import GroupChatIcon from '../GroupChatIcon';


type GroupChatItemProps = {
    roomId: number;
    roomName: string;
    description: string;
    createdOn: string;
    isGroupChat: boolean;
  }

const GroupChatItem = (props: GroupChatItemProps) => {
    const { sendMessage } = useSocket();
    const { currentChatRoom } = useChat();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      sendMessage("GET_MESSAGES", {roomId: props.roomId});
      sendMessage("GET_ROOM_INFO", {roomId: props.roomId});
    }
    
    
    return (
      <div onClick={handleClick} className={`server-overview ${currentChatRoom?.roomId === props.roomId ? "active" : ""}`}>
        {/* <div className='server-icon'></div> */}
        <GroupChatIcon className='server-icon' groupChatName={props.roomName} groupChatId={props.roomId} />
        <div className='server-info'>
          <h4>{props.roomName}</h4>
          <p>{props.description}@##:##</p>
        </div>
      </div>
    )
  }

  export default GroupChatItem;