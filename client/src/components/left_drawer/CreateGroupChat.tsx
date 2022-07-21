// import React from "React";
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdOutlineCameraAlt } from 'react-icons/md';
import { useBetterSocket } from '../../context/BetterSocketContext';

type CreateGroupChatProps = {};
type CreateForm = {
    serverName: string;
}

const CreateGroupChat = (props: CreateGroupChatProps) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<CreateForm>();
    const { on, off, sendMessage } = useBetterSocket();

    const onSubmit: SubmitHandler<CreateForm> = (data) => {
        sendMessage("GET_GROUP_CHAT_INFO", {serverName: data.serverName});
    }

    return (
        <form className='create-group-chat' onSubmit={handleSubmit(onSubmit)}>
            <label className="server-image-upload" htmlFor='server-image'>
                <p>Upload Image</p>
                <input id="server-image" name="server-image" type="file" />
                <div className="server-image-icon">
                    <MdOutlineCameraAlt />
                </div>
            </label>

            <label className="server-name-text" htmlFor='serverName'>Server Name</label>
            <input className="server-name" {...register("serverName", {required: true})}></input>

            <button>Create Group Chat</button>
        </form>
    );
}

export default CreateGroupChat;