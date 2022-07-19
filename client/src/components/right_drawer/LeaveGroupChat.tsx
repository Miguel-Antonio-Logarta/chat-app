// import { off } from "process";
import React, { useCallback, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useBetterSocket } from "../../context/BetterSocketContext";
import { useChat } from "../../context/ChatAppContext";
import { useSocketContext } from "../../context/SocketContext";
import { camelCaseKeys, snakeCaseKeys } from "../../utils/Utilities";
import Modal from "../Modal";

type Props = {
  showSelf: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
};

const LeaveGroupChat = ({ showSelf, roomName }: Props) => {
  // const {socket, isConnected, currentRoom, setCurrentRoom} = useSocketContext();
  const { sendMessage, on, off } = useBetterSocket();
  const { currentChatRoom, setCurrentChatRoom } = useChat();

  const handleLeaveRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage("LEAVE_ROOM", {roomId: currentChatRoom?.roomId});
    // if (isConnected) {
    //   socket.send(JSON.stringify(snakeCaseKeys({
    //     type: "LEAVE_ROOM",
    //     payload: {
    //       "roomId": currentRoom
    //     }
    //   })))
    // }
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
    on("LEAVE_ROOM", closeModal);

    return () => {
      off("LEAVE_ROOM", closeModal);
    }
  }, [on, off, closeModal])

  // useEffect(() => {
  //   if (isConnected) {
  //     socket.addEventListener('message', (event) => {
  //       const data = JSON.parse(event.data);
  //       if (data.type === "LEAVE_ROOM") {
  //         closeModal();
  //       }
  //     })
  //   }
  // }, [socket, isConnected, closeModal])

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
