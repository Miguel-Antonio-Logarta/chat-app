import React from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { onLogout, username } = useAuth();

  return (
    <header>
      <nav>
        <h1 className='logo'>Chat Room</h1>
        <ul>
          <li className='profile'>
            <div className='circle'></div>
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