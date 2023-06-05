import { useState, useReducer } from "react"

import FacilityCard from "./FacilityCard"
import SelectedReservation from "./SelectedReservation"

import CourtNavigation from "./Navigation/CourtNavigation/CourtNavigation"
import DateNavigation from "./Navigation/DateNavigation/DateNavigation"

const Reservation = ({user}) => {

  // Mock Data
  

  const facilityData = [
    {
      facilityName: "Court A",
      facilityId: '123',
      date: 'May 31, 2023',
      timeSlots: [
        {id: "111", time: "10:30AM", reserved: false},
        {id: "222", time: "11:30AM", reserved: false},
        {id: "333", time: "12:30PM", reserved: false}
      ]
    },
    {
      facilityName: "Court B",
      facilityId: '456',
      date: 'May 31, 2023',
      timeSlots: [
        {id: "444", time: "10:30AM", reserved: false},
        {id: "555", time: "11:30AM", reserved: false},
        {id: "666", time: "12:30PM", reserved: false}
      ]
    },
    {
      facilityName: "Court C",
      facilityId: '789',
      date: 'May 31, 2023',
      timeSlots: [
        {id: "777", time: "10:30AM", reserved: false},
        {id: "888", time: "11:30AM", reserved: false},
        {id: "999", time: "12:30PM", reserved: false}
      ]
    },
  ]

  const facilityDataExpanded = [
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

  

  const getCalendar = function (facilites) {
    const dates = new Set()
    facilites.forEach(facility=> {
          facility.dates.forEach((date)=>dates.add(date.date))
        }
      )
    return Array.from(dates)
  }

  const getDailyCourts = function (facilities,selectedDate) {
    const dailycourts = facilities.map((facility)=>{
      const obj = {...facility}
      const availableDates = facility.dates.filter((date)=> date.date === selectedDate)
      obj.dates = availableDates
      return obj
    })
    return dailycourts
  }
  


  // State
  const [selected, setSelected] = useState('Select a time?')
  const [selectedFacility, setSelectedFacility] = useState('123')
  const [timeSelected, setTimeSelected] = useState(false)
  const [facilityName, setFacilityName] = useState("")
  const [activeDate, setActiveDate] = useState(null)
  const [activeFacilities, setActiveFacilities] = useState([])


  const facilitiesReducer = (state,action) => {
    switch (action.type) {
      case 'UPDATE_TIMESLOTS': {
        
        const facilityIndex = state.findIndex(facility=>facility.facilityId===action.facilityId)
        if (facilityIndex === -1) {
          return state
        }

        const facility = state[facilityIndex]
        const updatedTimeSlots = facility.timeSlots.map(timeSlot=>{
          if (timeSlot.time === action.time) {
            return {...timeSlot, reserved: true}
          }
          return timeSlot
        })
        
        return [
          ...state.slice(0,facilityIndex),
          {...facility,timeSlots: updatedTimeSlots},
          ...state.slice(facilityIndex + 1)
        ]
      }
      default:
        return state
    }
  }

  const [facilities, dispatch] = useReducer(facilitiesReducer, facilityData)
  const [calendar, setActiveCalendar] = useState(getCalendar(facilityDataExpanded))
  const [activeCourts, setActiveCourts] = useState(null)
  
  // Functions

  const toggleSelected = function (time,facilityId) {
    setSelected(time)
    setSelectedFacility(facilityId)
    const selectedFacility = facilityDataExpanded.findIndex(facility=>facility.facilityId === facilityId)
    setFacilityName(facilityDataExpanded[selectedFacility].facilityName)
    setTimeSelected(true)
  }



  const toggleDate = function (event) {
    setActiveDate(event.target.value)
    setActiveCourts(getDailyCourts(facilityDataExpanded,event.target.value))
    console.log(getDailyCourts(facilityDataExpanded,event.target.value))
    setActiveFacilities(getDailyCourts(facilityDataExpanded,event.target.value))
  }


  
  const handleReservationSubmit = function () {
    
    dispatch({
      type: 'UPDATE_TIMESLOTS',
      facilityId: selectedFacility,
      time: selected
    })
    
      setSelected('Select a time?')
      setFacilityName("")
      setTimeSelected(false)
    }


  return (
    <div className="container">
      <div className="row vh-100">
        <DateNavigation dates={calendar} activeDate={activeDate} toggleDate={toggleDate} />

        <main className="p-3 col-6 container d-flex flex-column justify-content-center align-items-center flex-grow-1">
          <div className="d-flex gap-5">
          {activeFacilities.map((facility)=>
            <FacilityCard key={facility.facilityId} cardData={facility} toggleSelected={toggleSelected} selected={selected} timeSelected={timeSelected} handleReservationSubmit={handleReservationSubmit} />
          )}
          </div>
          <SelectedReservation selected={selected} timeSelected={timeSelected} facilityName={facilityName} submitReservation={handleReservationSubmit} />
        </main>
      </div>
    </div>
    
  )
}

export default Reservation