import React from 'react'
import CourtNavigationItem from './CourtNavigationItem'

const CourtNavigationList = ({courts,activeCourt,toggleCourt}) => {
  return (
    <nav className='nav nav-pills nav-fill flex-column'>
        {courts.map(court=><CourtNavigationItem court={court} activeCourt={activeCourt} toggleCourt={toggleCourt}/>)}
    </nav>
  )
}

export default CourtNavigationList