import React from 'react'

type Props = {}

const MessageList = (props: Props) => {
  return (
    <div className='chat-messages'>
        <div className='messages-list'>
            <div className='message'>
            <div className='profile-picture'></div>
            <p className='username'>Kiwilover</p>
            <div className="message-content">
                <p>lorem ipsum blah blah blah</p>
            </div>
            <p className='timestamp'>Sent: 6:49PM</p>
            </div>
            <div className='message owner'>
            <div className='profile-picture'></div>
            <p className='username'>__ILoveKiwis__ &#40;You&#41;</p>
            <p className='timestamp'>Sent: 7:00PM</p>
            <div className='message-content'>
                <p>The fitness gram pacer test is an aerobic capacity test dfa;kldjsf;klasjdfl;kajsdfkl;jasdl;kfjl;aksdjf;klasjdfl;kasjdfl;kjasdfkl;jasdl;kfjasdl;kfjal;skdfja;lksdjf;laksjdf;lkajsdf;lkajsdfl;aj</p>
            </div>
            </div>
        </div>
    </div>
  )
}

export default MessageList