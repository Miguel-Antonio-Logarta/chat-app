import React from 'react'
import { MdClose } from 'react-icons/md';
import Modal from './Modal'

type Props = {
  showSelf: React.Dispatch<React.SetStateAction<boolean>>;
  roomName: string;
}

const ConfirmAddGroupChat = (props: Props) => {
    const handleOnClose = (e: React.MouseEvent) => {
        e.preventDefault();
        props.showSelf(false);
    };
  return (
    <Modal onClose={handleOnClose}>
      <div className="join-group-chat" onMouseDown={(e) => e.stopPropagation()}>
        <button onClick={handleOnClose} className="close">
            <MdClose />
        </button>
        <div className="join-prompt">
          {/* <h2 className="thin-yellow-font">Add Group Chat</h2> */}
          <div className='large-server-icon'></div>
          <h2>Welcome to {props.roomName}</h2>
          <p>12 Members</p>
          <div className="join-buttons">
            <button className="join-confirm">Join</button>
            <button onClick={handleOnClose} className="join-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmAddGroupChat