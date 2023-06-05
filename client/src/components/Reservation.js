import React from 'react'
import { useState, useReducer } from 'react'

import FacilityCard from './FacilityCard'
import SelectedReservation from './SelectedReservation'
import DateNavigation from './Navigation/DateNavigation/DateNavigation'


const ACTIONS = {
  TOGGLE_DATE:'toggle-date',
  SELECT_TIMESLOT: 'select-timeSlot',
  SUBMIT_RESERVATION: 'submit-reservation'
}


const initialFacilities = [
  {
    facilityName: "Court A",
    facilityId: '123',
    dates: [ 
      {
        date: 'May 31, 2023',
        timeSlots: [
        {id: "timeslot1", time: "10:30AM", reserved: false},
        {id: "timeslot2", time: "11:30AM", reserved: false},
        {id: "timeslot3", time: "12:30PM", reserved: false}
        ]
      },
      {
        date: 'June 1, 2023',
        timeSlots: [
        {id: "timeslot4", time: "10:30AM", reserved: false},
        {id: "timeslot5", time: "11:30AM", reserved: false},
        {id: "timeslot6", time: "12:30PM", reserved: false}
        ]
      },
      {
        date: 'June 2, 2023',
        timeSlots: [
        {id: "timeslot7", time: "10:30AM", reserved: false},
        {id: "timeslot8", time: "11:30AM", reserved: false},
        {id: "timeslot9", time: "12:30PM", reserved: false}
        ]
      },
    ]
  },
  {
    facilityName: "Court B",
    facilityId: '345',
    dates: [ 
      {
        date: 'May 31, 2023',
        timeSlots: [
        {id: "timeslot10", time: "10:30AM", reserved: false},
        {id: "timeslot11", time: "11:30AM", reserved: false},
        {id: "timeslot12", time: "12:30PM", reserved: false}
        ]
      },
      {
        date: 'June 1, 2023',
        timeSlots: [
        {id: "timeslot13", time: "09:30AM", reserved: false},
        {id: "timeslot14", time: "11:30AM", reserved: false},
        {id: "timeslot15", time: "12:30PM", reserved: false},
        {id: "timeslot16", time: "01:30PM", reserved: false},
        ]
      },
      {
        date: 'June 2, 2023',
        timeSlots: [
        {id: "timeslot17", time: "10:30AM", reserved: false},
        {id: "timeslot18", time: "11:30AM", reserved: false},
        {id: "timeslot19", time: "12:30PM", reserved: false}
        ]
      },
    ]
  },
]



const ReservationReducer = () => {
  
  const reducer = (state,action) => {
    switch (action.type) {
      case ACTIONS.TOGGLE_DATE:
        const reservationSlots = state.initialFacilities.map((facility)=>{
          const obj = {}
          
          
          const timeSlots = facility.dates.filter(date=>date.date === action.date)[0].timeSlots
          
          
          obj.facilityName = facility.facilityName
          obj.facilityId = facility.facilityId
          obj.date = action.date
          
          obj.timeSlots = timeSlots
          return obj
        })


        return {...state, activeDate: action.date, reservationSlots}
      case ACTIONS.SELECT_TIMESLOT:
        return {
          ...state,
          selectedReservation:{
            reservationId: action.id,
            activeTime: action.timeslot,
            activeFacility: action.facilityId
          }
        };
      case ACTIONS.SUBMIT_RESERVATION:
        console.log(state.selectedReservation)
        return {...state, selectedReservation: {}}
      default:
        return state;
    }
  }

  const getAvailableTimes = (facilities) => {
    const availableDates = new Set()
    facilities.forEach(facility => {
      facility.dates.forEach(dateOption=>availableDates.add(dateOption.date))
    });
    return Array.from(availableDates)
  }

  const [state,dispatch] = useReducer(reducer,{initialFacilities, reservationSlots : [], availableDates:getAvailableTimes(initialFacilities), activeDate: "", activeTime: "", activeFacility:"", selectedReservation: {} })

  const toggleDate = (date) => {
    dispatch({type: 'toggle-date',date: date.target.value})
  }
  const toggleSelected = (timeslot, facilityId,id) => {
    dispatch({type: 'select-timeSlot', timeslot,facilityId,id })
  }

  const handleSubmit = () => {
    dispatch({type: 'submit-reservation'})
  }

  
  return (
    <div className="container">
      <div className="row vh-100 justify-content-evenly">
        <div className="col-3 d-flex">
          <DateNavigation dates={state.availableDates} toggleDate={toggleDate} />
        </div>
        

        <main className="p-3 col-3 d-flex container flex-column justify-content-center align-items center flex-grow-1">
          <div className="d-flex gap-5 justify-content-center">
          {state.reservationSlots.map((facility)=>
            <FacilityCard key={facility.facilityId} facilityData={facility} toggleSelected={toggleSelected}/>
          )}
          </div>
        </main>
            <div className='col-3 d-flex flex-column justify-content-center align-items-center'>
            {state.selectedReservation ? <SelectedReservation selectedReservation={state.selectedReservation} submitReservation={handleSubmit}></SelectedReservation> : ""}
            </div>
          
      </div>
    </div>
  )
}

export default ReservationReducer