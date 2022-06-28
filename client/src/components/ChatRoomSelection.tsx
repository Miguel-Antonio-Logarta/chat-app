import React, { useEffect, useState } from 'react'
import { camelCaseKeys } from '../Utilities';
import { useSocketContext } from './SocketContext'

type ChatRoomSelectionProps = {}
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

const ChatRoomSelection = (props: ChatRoomSelectionProps) => {
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

  // socket.addEventListener('message', (event) => {
  //   const evt = JSON.parse(event.data); 
  //   if (evt.type === "SEND_MESSAGE") {
  //     setMessages([
  //       ...messages,
  //       {
  //         id: evt.payload.id,
  //         username: evt.payload.username,
  //         message: evt.payload.message,
  //         timestamp: evt.payload.timestamp
  //       }
  //     ]);
  //   } else if (evt.type === "GET_MESSAGES") {
  //     setMessages(evt.payload);
  //   }
  return (
    <>
        <div className='chat-select'>
          {rooms.map((room) => <ChatRoomItem 
            key={room.roomId}
            roomId={room.roomId} 
            roomName={room.name} 
            isGroupChat={room.isGroupChat} 
            createdOn={room.createdOn} 
            description={"last message goes here "}
            />)
          }
          {/* <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Kiwilover's Group Chat</h4>
              <p>Hey I really love kiwis, we should... @ 6:49 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Your Local School Group Chat</h4>
              <p>Alright we'll call later tonight to study. I have to ea... @ 6:49 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Bumber McSnazzle</h4>
              <p>Meeting next week Monday? @ 2:30 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Ben Dover</h4>
              <p>Hey I really love kiwis, we should... @ 6:49 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>リリース's Baby</h4>
              <p>Hey I really love kiwis, we should... @ 6:49 PM</p>
            </div>
          </div> */}
        </div>
        <div className='chat-select-bottom'></div>
    </>
  )
}

export default ChatRoomSelection