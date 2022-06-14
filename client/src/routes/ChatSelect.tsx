import React, { useContext } from 'react'
import { AuthContext, useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import ServerOverview from '../components/ServerOverview';
// import { AuthContext } from '../App';

type Props = {}

const ChatSelect = (props: Props) => {
  // const auth = useContext(AuthContext);
  const { token, onLogout } = useAuth();

  return (
      <div className='full-page-dark'>
        <Navbar />
        <div className='chat-select-body'>
          <div className='chat-select'>
            {/* Maybe have h1 be a fixed element, while the rest of the server overviews can scroll */}
            <h1 className='center-text'>Select A Chat Room</h1>
            {/* <div> */}
              <ServerOverview />
              <ServerOverview />
              <ServerOverview />
              <ServerOverview />
              {/* <ServerOverview />
              <ServerOverview />
              <ServerOverview />
              <ServerOverview />
              <ServerOverview /> */}
            {/* </div> */}
          </div>
          {/* <p className='center-text'>{`Current token is: ${token}`}</p> */}
        </div>
      </div>
  )
}

export default ChatSelect