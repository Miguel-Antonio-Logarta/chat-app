import React from 'react'
import { useAuth } from '../context/AuthContext'
import ProfileImage from './ProfileImage';

const Navbar = () => {
  const { onLogout, username, userId } = useAuth();

  return (
    <header>
      <nav>
        <h1 className='logo'>Chat Room</h1>
        <ul>
          <li className='profile'>
            <ProfileImage className="profile-picture" id={userId as number} username={username as string}/>
            {/* <div className='circle'>
              <img className="profile-picture" src={`${process.env.REACT_APP_S3_BASE_OBJECT_URL}${process.env.REACT_APP_S3_PROFILE_IMAGES_LOCATION}${userId}.png`} alt={username as string}/>
            </div> */}
            <a href="#">{username}</a>
          </li>
          <li className='logout-section'>
            {/* <a href="#">Log Out</a> */}
            <button onClick={onLogout} >Log Out</button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar