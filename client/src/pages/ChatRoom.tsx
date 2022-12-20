import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import ChatRoomInformation from '../components/right_drawer/ChatRoomInformation'
import ChatRoomSelection from '../components/left_drawer/LeftHandMenu'
import MessageList from '../components/center/MessageList'

type Props = {}

const ChatRoom = (props: Props) => {
  // const { socket, isConnected } = useSocketContext();

  // useEffect(() => {
  //  return () => {
  //   if (isConnected) {
  //     socket.close();
  //   }
  //  } 
  // })

  return (
    <div className='chat-room'>
      <Navbar />
      <ChatRoomSelection />
      <ChatRoomInformation />
      <MessageList />
    </div>
  )
}

export default ChatRoom