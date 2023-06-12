export const ACTIONS = {
  TOGGLE_DATE:'toggle-date',
  SELECT_TIMESLOT: 'select-timeSlot',
  SUBMIT_RESERVATION: 'submit-reservation',
  SET_DATES: 'set-dates',
  LOAD_DATA: 'load-data'
}
const URL = `http://127.0.0.1:8080`
export const loadData = facilities => ({ type: ACTIONS.LOAD_DATA, facilities });
export const toggleDate = date => ({ type: ACTIONS.TOGGLE_DATE, date });
export const selectTimeSlot = (timeslot, facilityName, facilityId, id) => ({ type: ACTIONS.SELECT_TIMESLOT, timeslot, facilityName, facilityId, id });
export const setDates = dates => ({ type: ACTIONS.SET_DATES, dates });
// export const submitReservation = () => ({ type: ACTIONS.SUBMIT_RESERVATION });

// export const submitReservation = (reservationData) => {
//   console.log(reservationData)
//   return async (dispatch) => {
//     try {
//       const response  = await fetch(`${URL}/api/v1/reservations`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(reservationData)
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.message || 'Could not submit reservation')
//       }

//       dispatch({type: ACTIONS.SUBMIT_RESERVATION})

//     } catch (error) {
//       console.error('Error', error)
//     }
//   }
// }