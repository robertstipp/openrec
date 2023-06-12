import React from 'react'
import ReserveButton from './ReserveButton'

const SelectedReservation = ({selectedReservation, submitReservation}) => {
  const {activeFacility, activeTime} = selectedReservation
  return (
    <>
    <span className='badge bg-secondary'>
      {activeFacility}
    </span>
    <h1 className='fw-bold d-flex gap-3'>{activeTime} {activeFacility ? <ReserveButton onSubmit={submitReservation}/> : ""}</h1>
    </>
    
  )
}

export default SelectedReservation