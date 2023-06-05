import React from 'react'

const CourtNavigationItem = ({court,activeCourt,toggleCourt}) => {
  return (
    <button
      key={court}
      className={`nav-link ${activeCourt === court ? "active" : ""}`}
      value={court}
      onClick={toggleCourt}
    >
      {court}
    </button>
  )
}

export default CourtNavigationItem