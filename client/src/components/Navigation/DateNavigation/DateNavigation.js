import React from 'react'
import DateNavigationList from './DateNavigationList'


const DateNavigation = ({dates,activeDate,toggleDate}) => {
  // console.log(dates)
  return (
    <div className="d-flex col-6 align-items-center justify-content-center">
      <DateNavigationList dates={dates} activeDate={activeDate} toggleDate={toggleDate}></DateNavigationList>
    </div> 
  )
}

export default DateNavigation