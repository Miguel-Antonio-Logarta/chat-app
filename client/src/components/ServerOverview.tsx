import React from 'react'

type Props = {}

const ServerOverview = (props: Props) => {
  return (
    <div className='server-overview'>
        <div className='large-server-icon'></div>
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