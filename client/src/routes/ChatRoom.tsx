import React from 'react'
import Navbar from '../components/Navbar'
import { MdOutlineImage, MdTagFaces, MdOutlineTagFaces } from "react-icons/md"
type Props = {}

const ChatRoom = (props: Props) => {
  return (
    <div className='chat-room'>
        <Navbar />
        <div className='chat-select'>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Kiwilover's Group Chat</h4>
              <p>Hey I really love kiwis, we should... @ 6:49 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Your Local School Group Chat</h4>
              <p>Alright we'll call later tonight to study. I have to ea... @ 6:49 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Jasmine Lorenzo</h4>
              <p>Meeting next week Monday? @ 2:30 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Kiwilover's Group Chat</h4>
              <p>Hey I really love kiwis, we should... @ 6:49 PM</p>
            </div>
          </div>
          <div className='server-overview'>
            <div className='server-icon'></div>
            <div className='server-info'>
              <h4>Kiwilover's Group Chat</h4>
              <p>Hey I really love kiwis, we should... @ 6:49 PM</p>
            </div>
          </div>
        </div>
        <div className='chat-messages'>
            <div className='messages-list'>
              <div className='message'>
                <div className='profile-picture'></div>
                <p className='message-content'>lorem ipsum blah blah blah</p>
                <p className='timestamp'>Sent: 6:49PM</p>
              </div>
              <div className='message owner'>
                <div className='profile-picture'></div>
                <p className='timestamp'>Sent: 6:49PM</p>
                <p className='message-content'>The fitness gram pacer test is an aerobic capacity test</p>
              </div>
            </div>
        </div>
        <div className='chat-room-info'>
          <div className='large-server-icon'></div>
          <h2>Kiwilover's group chat</h2>
          <div className="online-status">
            <div className='status-circle online'></div>
            <p>4 Online</p>
            <div className='status-circle offline'></div>
            <p>6 Members</p>
          </div>
          <h3>Members</h3>
          <div className='group-chat-member'>
            <div className='profile-picture'></div>
            <h3>Kiwilover22</h3>
          </div>
          <div className="group-actions">
            <button>Invite Members</button>
            <button>Leave Group</button>
          </div>
        </div>
        <div className='chat-select-bottom'></div>
        <div className='chat-messages-input'>
          <button className="square-button">
            <MdOutlineImage className='icon'/>
          </button>
          
          <button className="square-button">
            <MdTagFaces className='icon' />
          </button>

          <input placeholder='Type a message...'/>
          <button className='send-message'>Send Message</button>
          {/* <MdOutlineTagFaces /> */}
        </div>
        <div className='chat-room-info-bottom'></div>
      </div>
  )
}

export default ChatRoom