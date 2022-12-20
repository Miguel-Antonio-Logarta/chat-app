// import { off } from "process";
import React, { useCallback, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useSocket } from "../../context/SocketContext";
import { useChat } from "../../context/ChatAppContext";
import Modal from "../Modal";

type Props = {
  showSelf: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
};

const LeaveGroupChat = ({ showSelf, roomName }: Props) => {
  const { sendMessage, on, off } = useSocket();
  const { currentChatRoom, setCurrentChatRoom } = useChat();

  const handleLeaveRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage("LEAVE_GROUP_CHAT", {roomId: currentChatRoom?.roomId});
  }

  const handleOnClose = (e: React.MouseEvent) => {
    e.preventDefault();
    showSelf(false);
  };

  const closeModal = useCallback((payload: any) => {
    setCurrentChatRoom(null);
    showSelf(false);
  }, [setCurrentChatRoom, showSelf])

  useEffect(() => {
    on("LEAVE_GROUP_CHAT", closeModal);

    return () => {
      off("LEAVE_GROUP_CHAT", closeModal);
    }
  }, [on, off, closeModal])

  return (
    <Modal onClose={handleOnClose}>
      <div className="leave-group-chat" onMouseDown={(e) => e.stopPropagation()}>
        <button onClick={handleOnClose} className="close">
            <MdClose />
        </button>
        <div className="leave-prompt">
          <h2 className="thin-yellow-font">Leave {roomName}?</h2>
          <p>Are you sure?</p>
          <div className="leave-buttons">
            <button onClick={handleOnClose} className="leave-cancel">Cancel</button>
            <button onClick={handleLeaveRoom} className="leave-confirm">Leave</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveGroupChat;
