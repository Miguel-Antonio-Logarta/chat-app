import React, { useEffect, useState } from 'react'
import { camelCaseKeys } from '../Utilities';
import { useSocketContext } from './SocketContext'
import { RiChatNewLine } from "react-icons/ri"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { MdOutlineGroups } from "react-icons/md"
import { BsChatDots } from "react-icons/bs"

type ChatRoomSelectionProps = {}
type GroupChatListProps = {}
type ChatRoomItemProps = {
  roomId: number;
  roomName: string;
  description: string;
  createdOn: string;
  isGroupChat: boolean;
}

const ChatRoomItem = (props: ChatRoomItemProps) => {
  const { socket } = useSocketContext();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    socket.send(JSON.stringify({
      type: "GET_MESSAGES",
      payload: {
        room_id: props.roomId
      }
    }))
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

const GroupChatList = (props: GroupChatListProps) => {
  const { socket } = useSocketContext();
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
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
  })

  return(
    <div className="select-group-chat">
      {rooms.map((room) => <ChatRoomItem
        key={room.roomId}
        roomId={room.roomId}
        roomName={room.name}
        isGroupChat={room.isGroupChat}
        createdOn={room.createdOn}
        description={"last message goes here "}
        />)
      }
      {/* {rooms.map((room) => <ChatRoomItem
        key={room.roomId}
        roomId={room.roomId}
        roomName={room.name}
        isGroupChat={room.isGroupChat}
        createdOn={room.createdOn}
        description={"last message goes here "}
        />)
      }
      {rooms.map((room) => <ChatRoomItem
        key={room.roomId}
        roomId={room.roomId}
        roomName={room.name}
        isGroupChat={room.isGroupChat}
        createdOn={room.createdOn}
        description={"last message goes here "}
        />)
      } */}
    </div>
  );
}

const ChatRoomSelection = (props: ChatRoomSelectionProps) => {
  return (
    <div className='chat-select'>
      <h2>Group Chats</h2>
      <GroupChatList />
      <div className='chat-select-bottom'>
        {/* Insert buttons here */}
        <button className="chat-select-bottom-buttons">
          <BsChatDots />
        </button>
        <button className="chat-select-bottom-buttons">
          <AiOutlineUsergroupAdd />
        </button>
        <button className="chat-select-bottom-buttons">
          <MdOutlineGroups />
        </button>
      </div>
    </div>
  )
}

export default ChatRoomSelection