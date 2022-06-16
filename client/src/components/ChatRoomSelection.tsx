import React from 'react'

type Props = {}

const ChatRoomSelection = (props: Props) => {
  return (
    <>
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
        <div className='chat-select-bottom'></div>
    </>
  )
}

export default ChatRoomSelection