import React from 'react'
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { MdOutlineGroups } from "react-icons/md"
import { BsChatDots } from "react-icons/bs"
import GroupChatList from './GroupChatList';

type LeftHandMenuProps = {}

const LeftHandMenu = (props: LeftHandMenuProps) => {
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

export default LeftHandMenu