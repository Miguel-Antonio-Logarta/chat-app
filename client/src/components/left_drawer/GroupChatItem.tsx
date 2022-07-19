import React from 'react'
import { camelCaseKeys, snakeCaseKeys } from '../../utils/Utilities';
import { useSocketContext } from "../../context/SocketContext";
import { useBetterSocket } from '../../context/BetterSocketContext';


type GroupChatItemProps = {
    roomId: number;
    roomName: string;
    description: string;
    createdOn: string;
    isGroupChat: boolean;
  }

const GroupChatItem = (props: GroupChatItemProps) => {
    // const { socket, isConnected } = useSocketContext();
    const { sendMessage } = useBetterSocket();
  
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      sendMessage("GET_MESSAGES", {roomId: props.roomId});
      sendMessage("GET_ROOM_INFO", {roomId: props.roomId});
      // if (socket && isConnected) {
      //   socket.send(JSON.stringify({
      //     type: "GET_MESSAGES",
      //     payload: {
      //       room_id: props.roomId
      //     }
      //   }))
        
      //   socket.addEventListener('message', (event) => {
      //     // if (event.data.type === "GET_MESSAGES") {
      //     //   const data = camelCaseKeys(JSON.parse(event.data));
      //     //   setCurrentRoom
      //     // }
      //     // console.log(data);
      //     // if (data.type === "GET_ROOM_INFO") {
      //     //   setRoomName(data.payload.roomName);
      //     //   setOnlineUsers(data.payload.onlineUsers);
      //     //   setOfflineUsers(data.payload.offlineUsers);
      //     //   setCurrentRoom(data.payload.roomId);
      //     // }
      //   })

      //   socket.send(JSON.stringify(snakeCaseKeys({
      //     type: "GET_ROOM_INFO",
      //     payload: {
      //       roomId: props.roomId
      //     } 
      //   })))
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