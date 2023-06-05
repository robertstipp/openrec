import React from 'react'
import CourtNavigationList from './CourtNavigationList'
const CourtNavigation = ({courts,activeCourt,toggleCourt}) => {
  return (
    <div className='d-flex col-6 align-items-center justify-content-center'>
      <CourtNavigationList courts={courts} activeCourt={activeCourt} toggleCourt={toggleCourt} />
    </div>
  )
}

export default CourtNavigation