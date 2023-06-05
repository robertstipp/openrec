import React from 'react'

const DateNavigationItem = ({date,activeDate,toggleDate}) => {
  return (
    <button
      key={date}
      className={`nav-link ${activeDate === date ? "active" : ""}`}
      value={date}
      onClick={toggleDate}
    >
      {date}
    </button>
  )
}

export default DateNavigationItem