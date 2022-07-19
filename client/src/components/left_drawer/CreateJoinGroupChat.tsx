import React, { useCallback, useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md';
import { useBetterSocket } from '../../context/BetterSocketContext';
import { useChat } from '../../context/ChatAppContext';
import Modal from '../Modal'
import CreateGroupChat from './CreateGroupChat';
import JoinGroupChat from './JoinGroupChat';
import Toggle from './Toggle';

type Props = {
    showSelf: any;
}

const CreateJoinGroupChat = ({showSelf}: Props) => {
    const { groupChats, setGroupChats } = useChat();
    const {on, off, sendMessage} = useBetterSocket();
    const [createGroupChat, setCreateJoinGroupChat] = useState(true);
    const handleOnClose = (e: React.MouseEvent) => {
        e.preventDefault();
        showSelf(false);
    }

    const handleJoin = useCallback((payload: any) => {
        showSelf(false);
        setGroupChats([...groupChats, {
            roomId: payload.roomId,
            name: payload.name,
            isGroupChat: payload.isGroupChat,
            createdOn: payload.createdOn
        }])
        sendMessage("GET_MESSAGES", {roomId: payload.roomId});
        sendMessage("GET_ROOM_INFO", {roomId: payload.roomId});
        // setCurrentChatRoom({
        //     roomId: payload.roomId,
        //     roomName: payload.name,
        //     isGroupChat: payload.isGroupChat,
        //     createdOn: payload.createdOn
        // })
    }, [groupChats, setGroupChats, showSelf, sendMessage]);

    useEffect(() => {
        on("JOIN_ROOM", handleJoin);

        return () => {
            off("JOIN_ROOM", handleJoin);
        }
    }, [on, off, handleJoin])

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