import React from 'react'

const TimeSlot = ({timeSlotData, facilityId, onTimeSelected}) => {
  const {_id:id,isReserved:reserved, startTime} = timeSlotData
  const dateObject = new Date(startTime)
  
  let hours = dateObject.getHours()
  let minutes = dateObject.getMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours: 12;
  minutes = minutes < 10 ? '0'+minutes : minutes
  const time = hours + ':' + minutes + ' ' + ampm
  return (
    <>
    <input type="btn" name="time" id={id} className="btn-check" disabled={reserved} autoComplete='off' onClick={() => onTimeSelected(time,facilityId,id)}/>
    <label className={reserved ? 'btn btn-outline-danger disabled' : 'btn btn-outline-danger' } htmlFor={id}>{time}</label>
  </>
  )
}

export default TimeSlot