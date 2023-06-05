import React from 'react'

const TimeSlot = ({timeSlotData, facilityId, onTimeSelected}) => {
  const {id,reserved,time} = timeSlotData
  return (
    <>
    <input type="btn" name="time" id={id} className="btn-check" disabled={reserved} autoComplete='off' onClick={() => onTimeSelected(time,facilityId,id)}/>
    <label className={reserved ? 'btn btn-outline-danger disabled' : 'btn btn-outline-danger' } htmlFor={id}>{time}</label>
  </>
  )
}

export default TimeSlot