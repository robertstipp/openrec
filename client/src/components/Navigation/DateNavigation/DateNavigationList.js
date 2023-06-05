import React from 'react'
import DateNavigationItem from './DateNavigationItem'

const DateNavigationList = ({dates,activeDate,toggleDate}) => {
  return (
    <nav className="nav nav-pills nav-fill flex-column">
      {dates.map(date=><DateNavigationItem key={date} date={date} activeDate={activeDate} toggleDate={toggleDate}/>)}
    </nav>
  )
}

export default DateNavigationList