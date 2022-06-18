import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdOutlineImage, MdTagFaces } from 'react-icons/md'
import {io, Socket} from "socket.io-client"
import { useSocketContext } from './SocketContext';

type Props = {
}

type SendMessageForm = {
  message: string;
}
const SendMessage = (props: Props) => {
  const { socket } = useSocketContext();
  const { register, handleSubmit } = useForm<SendMessageForm>();

  const onSubmit: SubmitHandler<SendMessageForm> = (data) => {
    console.log(data);
    socket?.emit("client_message_event", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='chat-messages-input'>
        <button className="square-button">
        <MdOutlineImage className='icon'/>
        </button>
        
        <button className="square-button">
        <MdTagFaces className='icon' />
        </button>

        <input {...register("message")} placeholder='Type a message...'/>
        <button type="submit" className='send-message'>Send Message</button>
    </form>
  )
}

export default SendMessage