// import React from "React";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useBetterSocket } from "../../context/BetterSocketContext";
import { useSocketContext } from "../../context/SocketContext";
import ErrorMessageContainer from "../ErrorMessageContainer";
import ConfirmJoinGroupChat from "./ConfirmJoinGroupChat";
// import { useSocket } from "../../context/BetterSocketContext";

type JoinGroupChatProps = {
    showModal: any;
};

type JoinForm = {
    roomId: string;
}

const JoinGroupChat = ({showModal}: JoinGroupChatProps) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<JoinForm>();
    const { on, off, onError, offError, sendMessage } = useBetterSocket();
    const [confirming, setConfirming] = useState(false);
    const [roomInfo, setRoomInfo] = useState<any>({});

    const onSubmit: SubmitHandler<JoinForm> = (data) => {
        sendMessage("JOIN_GROUP_CHAT", {roomId: data.roomId});
    }  

    useEffect(() => {
        const handleGettingInfo = (payload: any) => {
            setConfirming(true);
            setRoomInfo(payload);
        }
        
        const handleGettingInfoError = (payload: any) => {
            console.log("This error is being handled now", payload.message);
            setError("roomId", {message: payload.message});
        }

        on("JOIN_GROUP_CHAT", handleGettingInfo);
        onError("JOIN_GROUP_CHAT", handleGettingInfoError);

        return () => {
            off("JOIN_GROUP_CHAT", handleGettingInfo)
            offError("JOIN_GROUP_CHAT", handleGettingInfoError);
        };
    }, [on, off, onError, offError, setError])


    if (confirming) {
        return <ConfirmJoinGroupChat 
            roomId={roomInfo.roomId} 
            roomName={roomInfo.roomName}
            memberCount={roomInfo.memberCount}
            cancelJoin={() => setConfirming(false)} 
            confirmJoin={() => showModal(false)} />
    } else {
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
}

export default JoinGroupChat;