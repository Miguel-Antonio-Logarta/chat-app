import React, {useState} from 'react'
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { MdOutlineGroups } from "react-icons/md"
import { BsChatDots } from "react-icons/bs"
import GroupChatList from './GroupChatList';
import FriendList from './FriendList';
import FriendRequestList from './FriendRequestList';

type LeftHandMenuProps = {}

enum CurrentList {
  GroupChats,
  FriendList,
  FriendRequests
}

const LeftHandMenu = (props: LeftHandMenuProps) => {
  const [currentList, setCurrentList] = useState<CurrentList>(CurrentList.GroupChats);

  const renderList = (currVal: CurrentList) => {
    switch(currVal) {
      case CurrentList.GroupChats:
        return <GroupChatList />
      case CurrentList.FriendList:
        return <FriendList />
      case CurrentList.FriendRequests:
        return <FriendRequestList />
    }
  }

  return (
    <>
      <div className='chat-select'>
        {renderList(currentList)}
        <div className='chat-select-bottom'>
          <button 
            title="Show Group Chats" 
            className="chat-select-bottom-buttons"
            onClick={() => setCurrentList(CurrentList.GroupChats)}
          >
            <BsChatDots />
          </button>
          <button 
            title="Show My Friends" 
            className="chat-select-bottom-buttons"
            onClick={() => setCurrentList(CurrentList.FriendList)}
          >
            <MdOutlineGroups />
          </button>
          <button 
            title="Show Friend Requests" 
            className="chat-select-bottom-buttons"
            onClick={() => setCurrentList(CurrentList.FriendRequests)}
          >
            <AiOutlineUsergroupAdd />
          </button>
        </div>
      </div>
    </>
  )
}

export default LeftHandMenu