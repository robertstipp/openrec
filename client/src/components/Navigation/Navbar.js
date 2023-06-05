import React from 'react'

const Navbar = ({user, onLogout}) => {
  
  return (
    <div className="container-fluid mt-3 d-flex align-items-center gap-3">
      <div className='border p-2 fs-1 text-uppercase border-4 border-black'>
        <p className='mb-0 logo fs-3'>Open</p>
        <p className='mb-0 logo fs-3'>Rec!!!</p>
      </div>

      <div className='ms-auto d-flex gap-3 align-items-center'>
        <h5 className='mb-0'>{user}</h5>
        <button className="btn btn-outline-primary" onClick={onLogout}>Logout</button>
      </div>
      
    </div>
    
  )
}

export default Navbar