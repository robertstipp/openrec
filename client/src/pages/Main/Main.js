import React from 'react'
import { useContext } from 'react'

import { AuthContext } from '../../context/AuthContext'

// import Reservation from './Reservation_V1'
import Reservation from '../../components/Reservation/Reservation'
import Navbar from '../../components/Navigation/Navbar'




const Main = ({onLogout}) => {
  const {currentUser} = useContext(AuthContext)

  
  
  return (
    <div className='d-flex flex-column vh-100'>
      <Navbar user={currentUser} onLogout={onLogout} />
      <Reservation />
      {/* <Reservation user={currentUser} /> */}
    </div>
    
  )
}

export default Main