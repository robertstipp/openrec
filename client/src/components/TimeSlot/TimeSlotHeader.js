import React from 'react'

const TimeSlotHeader = ({locationName,facilityName,date}) => {
  return (
    <>
      <h1 className="fw-bold fs-4 text-center">{locationName}</h1>
      <h3 className="badge bg-danger fs-5">{facilityName}</h3>
      <h4 className="badge bg-secondary">{date}</h4>
    </>
  )
}

export default TimeSlotHeader