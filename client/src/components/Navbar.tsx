import React from 'react'

const Navbar = () => {
  return (
    <header>
      <nav>
        <h1 className='logo'>Chat Room</h1>
        <ul>
          <li className='profile'>
            <div className='circle'></div>
            <a href="#">potatochipse</a>
          </li>
          <li className='logout-section'>
            {/* <a href="#">Log Out</a> */}
            <button>Log Out</button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar