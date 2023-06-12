import React, { useEffect } from 'react'
import { useReducer } from 'react'

import FacilityCard from '../FacilityCard'
import SelectedReservation from './SelectedReservation'
import DateNavigation from '../Navigation/DateNavigation/DateNavigation'

import reducer from '../../services/Reducers/reservationReducer'
import { 
  ACTIONS, 
  loadData, 
  toggleDate as toggleDateAction, 
  selectTimeSlot, 
  submitReservation, 
  setDates } 
  from '../../services/Actions/reservationActions';


const URL = `http://127.0.0.1:8080`


const Reservation = () => {
  
  

  // const getAvailableTimes = (facilities) => {
  //   const availableDates = new Set()
  //   facilities.forEach(facility => {
  //     facility.dates.forEach(dateOption=>availableDates.add(dateOption.date))
  //   });
  //   return Array.from(availableDates)
  // }

  


  const [state,dispatch] = useReducer(reducer,{
    facilities: {}, 
    reservationSlots : [], 
    availableDates: [], 
    activeDate: "", 
    activeTime: "", 
    activeFacility:"", 
    activeFacilityId: "", 
    selectedReservation: {} 
  })

  const { availableDates, reservationSlots, selectedReservation } = state;

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/fields`)
        const results = await response.json()
        const timeSet = new Set()
        const fields = results.data.fields
        dispatch(loadData(fields))
        fields.forEach(field=>{
          field.timeSlots.forEach(timeSlot=>{
            const dateObject =  new Date(timeSlot.startTime)
            const dateStr = dateObject.toISOString().split('T')[0];
            timeSet.add(dateStr);
          })
        })
        dispatch(setDates(Array.from(timeSet)))
      }
      catch (error) {
        console.error(`Error fetching data:`, error)
      }
    }
    fetchData()
  },[])

  const toggleDate = date => dispatch(toggleDateAction(date.target.value));
  const toggleSelected = (timeslot, facilityName, facilityId, id) => dispatch(selectTimeSlot(timeslot, facilityName, facilityId, id));

  // ADD THIS TO ACTIONS SOMEHOW
  const handleSubmit =  async () => {
    try {
      const newReservation = {
        timeSlotId : selectedReservation.reservationId,
        user: 'Bobby'
      }
      const response  = await fetch(`${URL}/api/v1/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReservation)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not submit reservation')
      }

      dispatch({type: ACTIONS.SUBMIT_RESERVATION})

    } catch (error) {
      console.error('Error', error)
    }
  }

  

  return (
    <div className="container">
      <div className="row vh-100 justify-content-evenly">
        <div className="col-3 d-flex">
          {/* <DateNavigation dates={dates} toggleDate={toggleDate} /> */}
          <DateNavigation dates={availableDates} toggleDate={toggleDate} />
        </div>
        

        <main className="p-3 col-3 d-flex container flex-column justify-content-center align-items center flex-grow-1">
          <div className="d-flex gap-5 justify-content-center">
          {reservationSlots.map((facility)=>
            <FacilityCard key={facility.facilityId} facilityData={facility} toggleSelected={toggleSelected}/>
          )}
          </div>
        </main>

        <div className='col-3 d-flex flex-column justify-content-center align-items-center'>
          {selectedReservation ? <SelectedReservation selectedReservation={selectedReservation} submitReservation={handleSubmit}></SelectedReservation> : ""}
        </div>
          
      </div>
    </div>
  )
}

export default Reservation