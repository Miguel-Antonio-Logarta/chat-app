import React, { useCallback, useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md';
import { useSocket } from '../../context/SocketContext';
import Modal from '../Modal';

type Props = {
    friendId: number;
    friendUsername: string; 
    friendProfilePicture: string;
    cancelFriendRequest: () => void;
    confirmFriendRequest: () => void;
}

const ConfirmSendFriendRequest = ({confirmFriendRequest, ...props}: Props) => {
    const { sendMessage, onError, offError, on, off } = useSocket();
    const [error, setError] = useState<string | null>(null);

    const handleSendFriendRequest = (e: React.MouseEvent) => {
      setError(null);
      sendMessage("CONFIRM_SEND_FRIEND_REQUEST", { friendId: props.friendId });
    };
  
    const handleCancel = (e: React.MouseEvent) => {
      e.preventDefault();
      props.cancelFriendRequest();
    };

    const handleConfirmFriendRequestError = useCallback((payload: any) => {
      setError(payload.message);
    }, [])

    const handleSendFriendRequestSuccess = useCallback((payload: any) => {
      confirmFriendRequest();
    }, [confirmFriendRequest])
  
    useEffect(() => {
      on("CONFIRM_SEND_FRIEND_REQUEST", handleSendFriendRequestSuccess);
      onError("CONFIRM_SEND_FRIEND_REQUEST", handleConfirmFriendRequestError);
      return () => {
        off("CONFIRM_SEND_FRIEND_REQUEST", handleSendFriendRequestSuccess);
        offError("CONFIRM_SEND_FRIEND_REQUEST", handleConfirmFriendRequestError);
      }
    }, [off, on, onError, offError, handleConfirmFriendRequestError, handleSendFriendRequestSuccess])

    return (
      <Modal onClose={handleCancel}>
        <div className="join-group-chat" onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={handleCancel} className="close">
            <MdClose />
          </button>
          <div className="join-prompt">
            <img src={props.friendProfilePicture} alt={props.friendUsername} className="large-server-icon" />
            {/* {props.friendProfilePicture ? 
              <img src={props.friendProfilePicture} alt={props.friendUsername} className="large-server-icon" /> : 
              <div className="large-server-icon"></div>
            } */}
            <h2>{props.friendUsername}</h2>
            <p>Send this person a friend request?</p>
            <div className="join-buttons">
              <button onClick={handleSendFriendRequest} className="join-confirm">
                Send Friend Request
              </button>
              <button onClick={handleCancel} className="join-cancel">
                Cancel
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </Modal>
    );
}

export default ConfirmSendFriendRequest