import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai';
import { useChat } from '../../context/ChatAppContext';
import { useSocketContext } from '../../context/SocketContext';
import { camelCaseKeys } from '../../utils/Utilities';
import CreateJoinGroupChat from './CreateJoinGroupChat';
import GroupChatItem from './GroupChatItem';

type GroupChatListProps = {}

const GroupChatList = (props: GroupChatListProps) => {
    const { groupChats } = useChat();
    // const { socket, isConnected } = useSocketContext();
    // const [rooms, setRooms] = useState<any[]>([]);
    const [createJoinGroupChat, setCreateJoinGroupChat] = useState(false);
    // useEffect(() => {
    //   if (isConnected) {
    //     socket.send(JSON.stringify({
    //       type: "GET_GROUP_CHATS",
    //       payload: ""
    //     }))

    //     socket.addEventListener('message', (event) => {
    //       const data = JSON.parse(event.data);
    //       // console.log("WE ARE LISTENING");
    //       // console.log(data);
    //       if (data.type === "GET_GROUP_CHATS") {
    //         // console.log(data);
    //         // console.log("ROOMS GOT");
    //         const parsedData = camelCaseKeys(data);
    //         // console.log(parsedData);
    //         setRooms(parsedData.payload);
    //         // console.log("Rooms have been set");
    //       }
    //     })

    //     socket.addEventListener('message', (event) => {
    //       const data = JSON.parse(event.data);
    //       if (data.type === "LEAVE_ROOM") {
    //         const parsedData = camelCaseKeys(data);
    //         setRooms((r) => r.filter((room) => room.roomId !== parsedData.roomId));
    //       }
    //     })
    //   }
    // }, [socket, isConnected])

    return(
      <>
        {/* {<ConfirmAddGroupChat showSelf={setCreateJoinGroupChat} roomName={"test room"}/>} */}
        {createJoinGroupChat && <CreateJoinGroupChat showSelf={setCreateJoinGroupChat} />}
        <div className='upper-chat-list'>
          <h2>My Group Chats</h2>
          <button onClick={() => setCreateJoinGroupChat(true)}><AiOutlinePlus /></button>
        </div>
        <div className="select-group-chat">
          {groupChats.map((room) => <GroupChatItem
            key={room.roomId}
            roomId={room.roomId}
            roomName={room.name}
            isGroupChat={room.isGroupChat}
            createdOn={room.createdOn}
            description={"last message goes here "}
            />)
          }
        </div>
      </>
    );
  }

export default GroupChatList;