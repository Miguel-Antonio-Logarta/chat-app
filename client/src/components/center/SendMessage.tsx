import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineImage, MdTagFaces } from "react-icons/md";
import { useBetterSocket } from "../../context/BetterSocketContext";
import { useChat } from "../../context/ChatAppContext";
import { useSocketContext } from "../../context/SocketContext";
import { noBlankSpacesRegex } from "../../data/constants";

type Props = {};

type SendMessageForm = {
  message: string;
};

const SendMessage = (props: Props) => {
  // const { socket, isConnected, currentRoom } = useSocketContext();
  const { sendMessage, isConnected } = useBetterSocket();
  const { currentChatRoom } = useChat();
  const { register, handleSubmit, reset } = useForm<SendMessageForm>();

  const onSubmit: SubmitHandler<SendMessageForm> = (data) => {
    if (currentChatRoom !== null && isConnected()) {
      sendMessage("SEND_MESSAGE", {
        message: data.message, 
        roomId: currentChatRoom.roomId
      })
      reset();
    }
    // if (currentRoom !== null && isConnected) {
    //   socket.send(
    //     JSON.stringify({
    //       type: "SEND_MESSAGE",
    //       payload: {
    //         message: data.message,
    //         room_id: currentRoom,
    //       },
    //     })
    //   );
    //   reset();
    // }
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
        {...register("message", {
          disabled: currentChatRoom == null ? true : false,
          pattern: noBlankSpacesRegex
        })}
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
