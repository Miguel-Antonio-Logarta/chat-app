import React, { useState } from 'react'
import { MdClose, MdOutlineCameraAlt } from 'react-icons/md';
import Modal from './Modal'

type Props = {
    showSelf: any;
}

type ToggleProps = {
    toggleState: boolean;
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

type CreateGroupChatProps = {};

type JoinGroupChatProps = {};

const CreateGroupChat = (props: CreateGroupChatProps) => {
    return (
        <form className='create-group-chat'>
            <label className="server-image-upload" htmlFor='server-image'>
                <p>Upload Image</p>
                <input id="server-image" name="server-image" type="file" />
                <div className="server-image-icon">
                    <MdOutlineCameraAlt />
                </div>
            </label>

            <label className="server-name-text" htmlFor='Name your server'>Server Name</label>
            <input className="server-name" name="server-name"></input>

            <button>Create Group Chat</button>
        </form>
    );
}

const JoinGroupChat = (props: JoinGroupChatProps) => {
    return (
        <div className='join-group-chat-prompt'>
            <p>Join a group chat by entering the Room ID</p>
            <div className="modal-input">
                <input placeholder='Room ID' />
                <button>Join</button>
            </div>
        </div>
    );
}

const Toggle = ({toggleState, toggle}: ToggleProps) => {
    return (
        <div className={`toggle-wrapper ${toggleState ? "" : "toggle-join" }`}>
            <button className="add-group-chat-toggle" onClick={() => toggle(!toggleState)}>
                <span className={toggleState ? "dark": "light"}>Create Group Chat</span>
                <span className={toggleState ? "light": "dark"}>Join Group Chat</span>
            </button>
        </div>
    )
}

const CreateJoinGroupChat = ({showSelf}: Props) => {
    const [createGroupChat, setCreateJoinGroupChat] = useState(true);
    const handleOnClose = (e: React.MouseEvent) => {
        e.preventDefault();
        showSelf(false);
    }

  return (
    <Modal onClose={handleOnClose}>
        <div className='add-group-chat' onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={handleOnClose} className="close">
                <MdClose />
            </button>
            <h2 className='thin-yellow-font'>Add a Group Chat</h2>
            <Toggle toggleState={createGroupChat} toggle={setCreateJoinGroupChat} />
            {createGroupChat ? <CreateGroupChat /> : <JoinGroupChat />}
        </div>
    </Modal>
  )
}

export default CreateJoinGroupChat