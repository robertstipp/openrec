export const ACTIONS = {
  TOGGLE_DATE:'toggle-date',
  SELECT_TIMESLOT: 'select-timeSlot',
  SUBMIT_RESERVATION: 'submit-reservation',
  SET_DATES: 'set-dates',
  LOAD_DATA: 'load-data'
}

export const loadData = facilities => ({ type: ACTIONS.LOAD_DATA, facilities });
export const toggleDate = date => ({ type: ACTIONS.TOGGLE_DATE, date });
export const selectTimeSlot = (timeslot, facilityName, facilityId, id) => ({ type: ACTIONS.SELECT_TIMESLOT, timeslot, facilityName, facilityId, id });
export const submitReservation = () => ({ type: ACTIONS.SUBMIT_RESERVATION });
export const setDates = dates => ({ type: ACTIONS.SET_DATES, dates });