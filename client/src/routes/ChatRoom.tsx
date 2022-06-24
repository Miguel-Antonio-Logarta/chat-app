import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ChatRoomInformation from '../components/ChatRoomInformation'
import ChatRoomSelection from '../components/ChatRoomSelection'
import MessageList from '../components/MessageList'
import SendMessage from '../components/SendMessage'
import {io, Socket} from 'socket.io-client';
import { useSocketContext } from '../components/SocketContext'

type Props = {}

const ChatRoom = (props: Props) => {
  // const [socket, setSocket] = useState<Socket | null>(null);

  // useEffect(() => {
  //   const newSocket = io('ws://localhost:8000', {
	// 		path: '/ws/socket.io'
	// 	});

  //   setSocket(newSocket);
  //   // newSocket.on("connect", () => {
  //   //   console.log("connected");
  //   //     // $('#id2').val($('#id2').val() + '\n' + $('#id1').val() + '->' + data)
  //   //     socket.emit("client_connect_event", {data: 'User connected'});
  //   // });
    
  //   // newSocket.on("server_antwort01", () => {
  //   //   console.log("Entered server");
  //   // })
    
  //   // setSocket(newSocket);

  //   return () => {
  //     newSocket.close();
  //   }
  // }, []);
  // const socket = useSocketContext();
  const {socket} = useSocketContext();
  useEffect(() => {
    return () => socket.close();
  })
  
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