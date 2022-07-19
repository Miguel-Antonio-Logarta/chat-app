// import React from "React";
import { MdOutlineCameraAlt } from 'react-icons/md';

type CreateGroupChatProps = {};


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

export default CreateGroupChat;