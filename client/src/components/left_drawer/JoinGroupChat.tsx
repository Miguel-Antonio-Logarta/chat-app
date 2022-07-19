// import React from "React";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useBetterSocket } from "../../context/BetterSocketContext";
import { useSocketContext } from "../../context/SocketContext";
import ErrorMessageContainer from "../ErrorMessageContainer";
import ConfirmAddGroupChat from "./ConfirmAddGroupChat";
// import { useSocket } from "../../context/BetterSocketContext";

type JoinGroupChatProps = {};
type JoinForm = {
    roomId: string;
}

const JoinGroupChat = (props: JoinGroupChatProps) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<JoinForm>();
    // const { }
    // const { socket, isConnected } = useSocketContext();
    const { on, off, sendMessage } = useBetterSocket();
    const [confirming, setConfirming] = useState(false);
    const [roomInfo, setRoomInfo] = useState<any>({});

    const onSubmit: SubmitHandler<JoinForm> = (data) => {
        sendMessage("GET_GROUP_CHAT_INFO", {roomId: data.roomId});
    }  

    useEffect(() => {
        const handleGettingInfo = (payload: any) => {
            if (payload.exists) {
                // sendMessage("")
                // alert("Room exists");
                setConfirming(true);
                setRoomInfo(payload);
            } 
            else {
                setError("roomId", {message: payload.message});
            }
        }

        on("GET_GROUP_CHAT_INFO", handleGettingInfo);

        return () => off("GET_GROUP_CHAT_INFO", handleGettingInfo);
    }, [on, off, setError])


    if (confirming) {
        return <ConfirmAddGroupChat 
            roomId={roomInfo.roomId} 
            roomName={roomInfo.roomName}
            memberCount={roomInfo.memberCount}
            cancelJoin={() => setConfirming(false)} 
            confirmJoin={() => false} />
    }
    return (
        <div className='join-group-chat-prompt'>
            <p>Join a group chat by entering the Room ID</p>
            <form onSubmit={handleSubmit(onSubmit)} className="modal-input">
                <input placeholder='Room ID' {...register("roomId", {min: 0})}/>
                <button type="submit">Join</button>
            </form>
            {errors.roomId?.message && <p className="error-message">{errors.roomId?.message}</p>}
        </div>
    );
}

export default JoinGroupChat;