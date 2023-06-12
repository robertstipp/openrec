import React from 'react'

import TimeSlotHeader from './TimeSlot/TimeSlotHeader'
import TimeSlotsList from './TimeSlot/TimeSlotsList'


const FacilityCard = ({facilityData,toggleSelected}) => {
    const {facilityId, locationName, facilityName, date, timeSlots} = facilityData
    
  return (

    <article key={facilityId} className='d-flex flex-column justify-content-start align-items-center'>
      <TimeSlotHeader locationName={locationName} facilityName={facilityName} date={date}  />
      <TimeSlotsList timeSlots={timeSlots} facilityName={facilityName} onTimeSelected={toggleSelected} facilityId={facilityId} />
    </article>
    
  )
}

export default FacilityCard