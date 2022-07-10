import React, { useEffect, useState } from 'react'
import { useSocketContext } from "./SocketContext";
import { camelCaseKeys } from '../Utilities';
import GroupChatItem from './GroupChatItem';

type GroupChatListProps = {}

const GroupChatList = (props: GroupChatListProps) => {
    const { socket, isConnected } = useSocketContext();
    const [rooms, setRooms] = useState<any[]>([]);
  
    useEffect(() => {
      if (isConnected) {
        socket.addEventListener('open', (event) => {
          socket.send(JSON.stringify({
            type: "GET_ROOMS",
            payload: ""
          }))
        })
        socket.addEventListener('message', (event) => {
          const evt = camelCaseKeys(JSON.parse(event.data));
          if (evt.type === "GET_ROOMS") {
            console.log(evt.payload);
            setRooms(evt.payload);
          }
        })
      }
    }, [socket, isConnected])
  
    return(
      <div className="select-group-chat">
        {rooms.map((room) => <GroupChatItem
          key={room.roomId}
          roomId={room.roomId}
          roomName={room.name}
          isGroupChat={room.isGroupChat}
          createdOn={room.createdOn}
          description={"last message goes here "}
          />)
        }
      </div>
    );
  }

export default GroupChatList;