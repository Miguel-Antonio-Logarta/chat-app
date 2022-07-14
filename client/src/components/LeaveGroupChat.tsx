import React from "react";
import { MdClose } from "react-icons/md";
import Modal from "./Modal";

type Props = {
  showSelf: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
};

const LeaveGroupChat = ({ showSelf, roomName }: Props) => {
  const handleOnClose = (e: React.MouseEvent) => {
    e.preventDefault();
    showSelf(false);
  };

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
            <button className="leave-confirm">Leave</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveGroupChat;
