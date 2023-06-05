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

module.exports = initialFacilities