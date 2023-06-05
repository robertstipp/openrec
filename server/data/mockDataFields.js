const mockFields = [
  { 
    name: 'Court A', 
    sport: 'Tennis', 
    location: 'East Side', 
    timeSlots: [
      { startTime: new Date(2023, 5, 31, 10, 30), endTime: new Date(2023, 5, 31, 11, 30), isReserved: false },
      { startTime: new Date(2023, 5, 31, 12, 30), endTime: new Date(2023, 5, 31, 13, 30), isReserved: false },
    ]
  },
  { 
    name: 'Court B', 
    sport: 'Tennis', 
    location: 'West Side',
    timeSlots: [
      { startTime: new Date(2023, 5, 31, 14, 30), endTime: new Date(2023, 5, 31, 15, 30), isReserved: false },
      { startTime: new Date(2023, 5, 31, 16, 30), endTime: new Date(2023, 5, 31, 17, 30), isReserved: false },
    ]
  },
];