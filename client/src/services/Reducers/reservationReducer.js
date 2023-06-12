import { ACTIONS } from '../Actions/reservationActions';

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_DATA: 
      return {...state, facilities: action.facilities};

    case ACTIONS.TOGGLE_DATE:
      const reservationSlots = state.facilities.map((facility)=>{
        const obj = {}
        const selectedDate = action.date
        const timeSlots = facility.timeSlots
          .filter(timeSlot => {
            const dateObject = new Date(timeSlot.startTime)
            const dateStr = dateObject.toISOString().split('T')[0];
            return dateStr === selectedDate
          })

        obj.facilityName = facility.name
        obj.facilityId = facility._id
        obj.date = action.date
        obj.timeSlots = timeSlots
        return obj
      })
      return {...state, activeDate: action.date, reservationSlots};

    case ACTIONS.SELECT_TIMESLOT:
      return {
        ...state,
        selectedReservation: {
          reservationId: action.id,
          activeTime: action.timeslot,
          activeFacility: action.facilityName,
          activeFacilityId: action.facilityId
        }
      };

    case ACTIONS.SUBMIT_RESERVATION:
      return {...state, selectedReservation: {}};

    case ACTIONS.SET_DATES:
      return {...state, availableDates: action.dates};

    default:
      return state;
  }
}

export default reducer;
