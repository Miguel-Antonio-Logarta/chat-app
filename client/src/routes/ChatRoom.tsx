import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import ChatRoomInformation from '../components/ChatRoomInformation'
import ChatRoomSelection from '../components/ChatRoomSelection'
import MessageList from '../components/MessageList'
import SendMessage from '../components/SendMessage'
import io from 'socket.io-client';

type Props = {}

const ChatRoom = (props: Props) => {
  useEffect(() => {
    const socket = io('ws://localhost:8000', {
			path: '/ws/socket.io'
		});

    socket.on("connect", () => {
      console.log("connected");
        // $('#id2').val($('#id2').val() + '\n' + $('#id1').val() + '->' + data)
    });
  }, []);

  return (
    <div className='chat-room'>
      <Navbar />
      <ChatRoomSelection />
      <ChatRoomInformation />
      <MessageList />
      <SendMessage />
    </div>
  )
}

export default ChatRoom