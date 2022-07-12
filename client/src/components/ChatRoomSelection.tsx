import React, {useState} from 'react'
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { MdOutlineGroups } from "react-icons/md"
import { BsChatDots } from "react-icons/bs"
import GroupChatList from './GroupChatList';
import Modal from './Modal';

type LeftHandMenuProps = {}
type samplePromptProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SamplePrompt = (props: samplePromptProps) => {
  return (
    <Modal close={() => props.setShowModal(false)}>
      <p>This is some text</p>
    </Modal>
  )
}

const ShowFriendRequests = () => {
  return (
    <>
      <h2>Friends</h2>
      <div>
      
      </div>
    </>
  )
}

const LeftHandMenu = (props: LeftHandMenuProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  return (
    <>
      {showModal && <SamplePrompt setShowModal={setShowModal}/>}
      <div className='chat-select'>
        {showFriends ? <ShowFriendRequests /> : <GroupChatList />}
        {/* <GroupChatList /> */}
        <div className='chat-select-bottom'>
          {/* Insert buttons here */}
          <button className="chat-select-bottom-buttons" onClick={() => setShowFriends(false)}>
            {/* Show group chats */}
            <BsChatDots />
          </button>
          <button className="chat-select-bottom-buttons" onClick={() => setShowFriends(true)}>
            {/* Show friend requests */}
            <AiOutlineUsergroupAdd />
          </button>
          <button className="chat-select-bottom-buttons">
            {/* Show friends */}
            <MdOutlineGroups />
          </button>
        </div>
      </div>
    </>
  )
}

export default LeftHandMenu