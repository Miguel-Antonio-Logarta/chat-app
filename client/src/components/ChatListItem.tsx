import React from 'react'

type Props = {
    handleClick: any;
    roomName: string;
    lastMessage: string;
}

const ChatListItem = (props: Props) => {
    return (
        <div onClick={props.handleClick} className='server-overview'>
          <div className='server-icon'></div>
          <div className='server-info'>
            <h4>{props.roomName}</h4>
            <p>{props.lastMessage}@##:##</p>
          </div>
        </div>
    )
}

export default ChatListItem