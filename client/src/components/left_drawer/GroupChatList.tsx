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
    const [createJoinGroupChat, setCreateJoinGroupChat] = useState(false);

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