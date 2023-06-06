import React from 'react'
import TimeSlotItem from './TimeSlotItem'


const TimeSlotsList = ({timeSlots, onTimeSelected, facilityId}) => {
  console.log(timeSlots)
  return (
    <div className='btn-group-vertical mb-4' role='group'>
        {timeSlots.map((timeSlot)=><TimeSlotItem key={timeSlot._id} timeSlotData={timeSlot} facilityId={facilityId} onTimeSelected={onTimeSelected} />)}
    </div>
  )
}

export default TimeSlotsList