import React from 'react'

import TimeSlotHeader from './TimeSlotHeader'
import TimeSlotsList from './TimeSlotsList'


const FacilityCard = ({facilityData,toggleSelected}) => {
    const {facilityId, facilityName, date, timeSlots} = facilityData
  return (

    <article key={facilityId} className='d-flex flex-column justify-content-start align-items-center'>
      <TimeSlotHeader facilityName={facilityName} date={date}  />
      <TimeSlotsList timeSlots={timeSlots} facilityName={facilityName} onTimeSelected={toggleSelected} facilityId={facilityId} />
    </article>
    
  )
}

export default FacilityCard