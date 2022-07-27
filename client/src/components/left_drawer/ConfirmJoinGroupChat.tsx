// import React from 'react'
import React from "react";
import { MdClose } from "react-icons/md";
import { useBetterSocket } from "../../context/BetterSocketContext";
import Modal from "../Modal";

// There are two close events we should pass as props
// Closing whole modal, and cancel joining the room which closes this modal, but not the one before it.
type Props = {
  cancelJoin: () => void; // Closes CofirmJoinGroupChat Modal
  confirmJoin: () => void; // Closes the entire modal
  roomName: string;
  memberCount: number;
  roomId: number;
};

const CofirmJoinGroupChat = (props: Props) => {
  const { sendMessage } = useBetterSocket();

  const handleJoin = (e: React.MouseEvent) => {
    sendMessage("CONFIRM_JOIN_GROUP_CHAT", { roomId: props.roomId });
    props.confirmJoin();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    props.cancelJoin();
  };

  // const handleOnClose = (e: React.MouseEvent) => {
  //     e.preventDefault();
  //     props.cancelJoin();
  // };
  return (
    <Modal onClose={handleCancel}>
      <div className="join-group-chat" onMouseDown={(e) => e.stopPropagation()}>
        <button onClick={handleCancel} className="close">
          <MdClose />
        </button>
        <div className="join-prompt">
          {/* <h2 className="thin-yellow-font">Add Group Chat</h2> */}
          <div className="large-server-icon"></div>
          <h2>Welcome to {props.roomName}</h2>
          <p>{props.memberCount} Members</p>
          <div className="join-buttons">
            <button onClick={handleJoin} className="join-confirm">
              Join
            </button>
            <button onClick={handleCancel} className="join-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CofirmJoinGroupChat;
