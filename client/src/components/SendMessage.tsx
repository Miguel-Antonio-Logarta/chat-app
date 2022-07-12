import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineImage, MdTagFaces } from "react-icons/md";
import { useSocketContext } from "../context/SocketContext";

type Props = {};

type SendMessageForm = {
  message: string;
};

const SendMessage = (props: Props) => {
  const { socket, isConnected, currentRoom } = useSocketContext();
  const { register, handleSubmit, reset } = useForm<SendMessageForm>();

  const onSubmit: SubmitHandler<SendMessageForm> = (data) => {
    if (currentRoom !== null && isConnected) {
      socket.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: {
            message: data.message,
            room_id: currentRoom,
          },
        })
      );
      reset();
    }
  };

  return (
    // <div className="chat-messages-input">
    <form onSubmit={handleSubmit(onSubmit)} className="chat-messages-input">
      <button className="square-button">
        <MdOutlineImage className="icon" />
      </button>

      <button className="square-button">
        <MdTagFaces className="icon" />
      </button>
      <input
        {...register("message")}
        autoComplete="off"
        placeholder="Type a message..."
      />
      <button type="submit" className="send-message">
        Send Message
      </button>
    </form>
    // </div>
  );
};

export default SendMessage;
