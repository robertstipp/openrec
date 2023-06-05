import React from 'react'
import TimeSlotItem from './TimeSlotItem'


const TimeSlotsList = ({timeSlots, onTimeSelected, facilityId}) => {
  return (
    <div className='btn-group-vertical mb-4' role='group'>
        {timeSlots.map((timeSlot)=><TimeSlotItem key={timeSlot.id} timeSlotData={timeSlot} facilityId={facilityId} onTimeSelected={onTimeSelected} />)}
    </div>
  )
}

export default TimeSlotsList