import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ChatRoomInformation from '../components/ChatRoomInformation'
import ChatRoomSelection from '../components/LeftHandMenu'
import MessageList from '../components/MessageList'
import SendMessage from '../components/SendMessage'
import {io, Socket} from 'socket.io-client';
import { useSocketContext } from '../context/SocketContext'
// import { useWSContext } from '../components/WSContext'
// import { useSocketContextV2 } from '../components/SocketContextV2'

type Props = {}

const ChatRoom = (props: Props) => {
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
   return () => {
    if (isConnected) {
      socket.close();
    }
   } 
  })

  return (
    <div className='chat-room'>
      <Navbar />
      <ChatRoomSelection />
      <ChatRoomInformation />
      <MessageList />
      {/* <SendMessage /> */}
    </div>
  )
}

export default ChatRoom