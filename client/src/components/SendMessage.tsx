import React from 'react'
import { MdOutlineImage, MdTagFaces } from 'react-icons/md'

type Props = {}

const SendMessage = (props: Props) => {
  return (
    <div className='chat-messages-input'>
        <button className="square-button">
        <MdOutlineImage className='icon'/>
        </button>
        
        <button className="square-button">
        <MdTagFaces className='icon' />
        </button>

        <input placeholder='Type a message...'/>
        <button className='send-message'>Send Message</button>
    </div>
  )
}

export default SendMessage