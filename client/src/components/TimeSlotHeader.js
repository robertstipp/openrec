import React from 'react'

const TimeSlotHeader = ({facilityName,date}) => {
  return (
    <>
      <h1 className="fw-bold">{facilityName}</h1>
      <h4 className="badge bg-secondary">{date}</h4>
    </>
  )
}

export default TimeSlotHeader