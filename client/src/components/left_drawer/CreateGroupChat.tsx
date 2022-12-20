// import React from "React";
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdOutlineCameraAlt } from 'react-icons/md';
import { useSocket } from '../../context/SocketContext';

type CreateGroupChatProps = {
    showModal: any;
};

type CreateForm = {
    serverName: string;
}

const CreateGroupChat = (props: CreateGroupChatProps) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<CreateForm>();
    const { onError, offError, sendMessage } = useSocket();

    const onSubmit: SubmitHandler<CreateForm> = (data) => {
        // sendMessage("GET_GROUP_CHAT_INFO", {serverName: data.serverName});
        sendMessage("CREATE_GROUP_CHAT", {serverName: data.serverName});
        props.showModal(false);
    }

    useEffect(() => {
        // const handleGettingInfo = (payload: any) => {
        //     setConfirming(true);
        //     setRoomInfo(payload);
        // }
        
        const handleGettingInfoError = (payload: any) => {
            console.log("This error is being handled now", payload.message);
            setError("serverName", {message: payload.message});
        }

        // on("CREATE_GROUP_CHAT", handleGettingInfo);
        onError("CREATE_GROUP_CHAT", handleGettingInfoError);

        return () => {
            // off("CREATE_GROUP_CHAT", handleGettingInfo)
            offError("CREATE_GROUP_CHAT", handleGettingInfoError);
        };
    }, [onError, offError, setError])

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
            {errors.serverName?.message && <p className="error-message">{errors.serverName?.message}</p>}
            <button>Create Group Chat</button>
        </form>
    );
}

export default CreateGroupChat;