import React from 'react'
import GroupChatIcon from './GroupChatIcon'

type Props = {}

const ServerOverview = (props: Props) => {
  return (
    <div className='server-overview'>
        <div className='large-server-icon'></div>
        {/* <GroupChatIcon className='large-server-icon' groupChatId={} /> */}
        <h2>Potatolovers's Fun Group Chat</h2>
        <div className="statuses">
            <div className='status-circle online'></div>
            <span>2 Online</span>
            <div className='status-circle offline'></div>
            <span>4 Members</span>
        </div>
    </div>
  )
}

export default ServerOverview