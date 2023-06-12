import React from 'react'

const ReserveButton = ({onSubmit}) => {
  return (
    <button className='btn btn-success' onClick={onSubmit}>Reserve</button>
  )
}

export default ReserveButton