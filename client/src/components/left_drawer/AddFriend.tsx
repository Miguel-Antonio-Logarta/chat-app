import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useSocket } from "../../context/SocketContext";
import Modal from "../Modal";
import ConfirmSendFriendRequest from "./ConfirmSendFriendRequest";

type Props = {
  showSelf: any;
};

type FriendForm = {
  userId: number;
};

type FriendDataType = {
    friendId: number;
    friendUsername: string;
    friendProfilePicture: string;
}

const AddFriend = ({ showSelf }: Props) => {
  const { on, off, sendMessage, onError, offError } = useSocket();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FriendForm>();
  const [friendData, setFriendData] = useState<FriendDataType | null>(null);
  const [confirming, setConfirming] = useState(false);

  const onSubmit: SubmitHandler<FriendForm> = (data) => {
    // console.log(data);
    sendMessage("SEND_FRIEND_REQUEST", {friendId: data.userId});
  };

  const handleOnClose = (e: React.MouseEvent) => {
    // console.log("I'm being closed");
    e.preventDefault();
    showSelf(false);
  };

  useEffect(() => {
    const handleSendFriendRequest = (payload: any) => {
      console.log(payload);
        setFriendData({
            friendId: payload.friendId,
            friendUsername: payload.friendUsername,
            friendProfilePicture: payload.profilePicture
        })
        setConfirming(true);
    }

    const handleSendFriendRequestError = (payload: any) => {
      setError("userId", {message: payload.message});
    }

    on("SEND_FRIEND_REQUEST", handleSendFriendRequest);
    onError("SEND_FRIEND_REQUEST", handleSendFriendRequestError);

    return () => {
        off("SEND_FRIEND_REQUEST", handleSendFriendRequest);
        offError("SEND_FRIEND_REQUEST", handleSendFriendRequestError);
    }
  }, [on, off, onError, offError, setError])

  if (confirming && friendData) {
    return <ConfirmSendFriendRequest 
                friendId={friendData.friendId} 
                friendUsername={friendData.friendUsername}
                friendProfilePicture={friendData.friendProfilePicture} 
                cancelFriendRequest={() => setConfirming(false)}
                confirmFriendRequest={() => showSelf(false)}
            />
  } 
  else {
      return (
        <Modal onClose={handleOnClose}>
          <div className="add-friend" onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={handleOnClose} className="close">
              <MdClose />
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="thin-yellow-font">Send a Friend Request</h2>
              <p>Add a friend by entering their User ID</p>
              <div className="modal-input">
                <input
                  autoComplete="off"
                  placeholder="User ID"
                  {...register("userId", { required: true })}
                />
                <button>Send</button>
              </div>
                {errors.userId?.message && <p className="error-message">{errors.userId.message}</p>}
            </form>
          </div>
        </Modal>
      );
  }
};

export default AddFriend;
