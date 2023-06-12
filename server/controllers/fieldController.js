const {Field} = require('../models/fieldModel')
const { TimeSlot } = require('../models/timeSlotModel')
const Location = require('../models/locationModel')
const {Errorhandler} = require('./errorController')
const catchAsync = require('../utils/catchAsync')

exports.getAllFields = catchAsync(async (req,res, next) => {


    const {sports, hasParking, hasAvailable} = req.query

    // Construct a filter object from the query paramters
    let filter = {}
    if (sports !== undefined) {
      let sportsArray = sports.split(",")
      filter.sports = { $all : sportsArray}
    }

    if (hasParking !== undefined) {
      if (hasParking !== 'true' && hasParking !== 'false') {
        throw next(new Errorhandler(400,'Invalid Query Parameter: hasParking must be true or false '))
      }
      filter.hasParking = (hasParking === 'true')
    }

    let fields = await Field
      .find(filter)
      .populate('location')
      .populate('timeSlots')
    

    if (hasAvailable !== undefined && hasAvailable === 'true') {
      if (hasAvailable !== 'true' && hasAvailable !== 'false') {
        throw next(new Errorhandler(400,'Invalid Query Parameter: hasAvailable must be true or false '))
      }


      fields = fields.filter(field=>field.timeSlots.some(timeSlot=>timeSlot.isReserved === false))
    }

    if (fields.length == 0) {
      throw next(new Errorhandler(404, 'No fields found'))
    }
    // Send Response
    res.status(200).json({
      status: 'success',
      results: fields.length,
      data: {
        fields
      }
    })
  
})

exports.getField = catchAsync(async (req,res,next) => {
    const field = await Field.findById(req.params.id).populate('timeSlots')
    
    if (!field) {
      throw next(new Errorhandler(404, 'No Field was found with this ID'))
    }
    res.status(200).json({
      status: 'success',
      data: {
        field
      }
    })


})

exports.getAllTimeSlots = (async (req,res) => {
  
    const {isReserved} = req.query
    const isReservedBool = isReserved === 'true'
    
    const fields = await Field.find().populate('timeSlots')
    const timeSlots = fields.reduce((acc,curr)=>{

      // filter if isReserved query parameter is provided
      if (isReserved !== undefined) {
        const availableTimeSlots = curr.timeSlots.filter((timeSlot)=>timeSlot.isReserved === isReservedBool)
        acc = acc.concat(availableTimeSlots)
      } else {
        acc = acc.concat(curr.timeSlots)
      }
      return acc
    },[])
    res.status(200).json({
      status: 'success',
      data: {
        timeSlots: timeSlots
      }
    })

})

exports.getTimeSlotsForDay = catchAsync(async (req,res,next) => {

    const dateRegexp = /^\d{4}-\d{2}-\d{2}$/;


    // Added Error handing for invalid date
    if (!dateRegexp.test(req.params.date)) {
      throw next(new Errorhandler(400, 'Invalid Date'))   
    }
  
    const targetDate = new Date(req.params.date)
    const nextDay = new Date(targetDate)
    nextDay.setDate(targetDate.getDate() + 1)
    
    const fields = await Field.find({
      timeSlots: {
        $elemMatch: {
          startTime: {
            $gte: targetDate,
            $lt: nextDay
          }
        }
      }
    }).populate('timeSlots')


    const timeSlots = []
    fields.forEach(field => {
      field.timeSlots.forEach(timeSlot => {
        if (timeSlot.startTime >= targetDate && timeSlot.startTime < nextDay) {
          timeSlots.push(timeSlot)
        }
      })
    })

    if (timeSlots.length === 0 ) {
      throw next(new Errorhandler(404, 'No time slots found'))
    }
    res.status(200).json({
      status: 'success',
      data: {
        timeSlots: timeSlots
      }
    })

})

exports.createField = catchAsync(async (req,res,next) => {  
    const {name} = req.body
    const isNameInUse = await Field.isNameInUse(name)
    if (isNameInUse) {
      throw next(new Errorhandler(404, 'Name already in use'))
    }
    const newField = await Field.create(req.body)
    res.status(200).json({
      status: 'success',
      data: {
        newField
      }
    })
})

exports.deleteField = catchAsync(async (req,res,next) => {
  
    const field = await Field.findById(req.params.id)

    if (!field) {
      throw next(new Errorhandler(400, 'No field was found with this id'))  
    }

    await Location.updateOne(
      { fields: req.params.id },
      { $pull: { fields: req.params.id } }
    );
    

    await Field.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null
    })
  
})

exports.addTimeSlot = catchAsync (async (req,res, next) => {
  
    // Get the field ID from the route parameters
    const fieldId = req.params.id
    
    // Fetch the field from the database
    const field  = await Field.findById(fieldId)

    // Check if field was found
    if (!field) {
      throw next(new Errorhandler(404, 'No Field was found with this ID'))
    }


    console.log(field.location)
    // Create new time slot from request body
    const newTimeSlot = {...req.body, field: fieldId,location: field.location}
    newTimeSlot.startTime = new Date(newTimeSlot.startTime)
    newTimeSlot.endTime = new Date(newTimeSlot.endTime)

    
    if (isNaN(newTimeSlot.startTime) || isNaN(newTimeSlot.endTime)) {
      throw next(new Errorhandler(400, 'Invalid start or end time'))
    }

    if (newTimeSlot.startTime < new Date()) {
      throw next(new Errorhandler(400, 'Start time must be in the future'))
    }

    if (newTimeSlot.startTime.toISOString().substring(0,10) !== newTimeSlot.endTime.toISOString().substring(0,10)) {
      throw next(new Errorhandler(400, 'Start and end times must be on the same day'))
    }
    
    const diffInMinutes = (newTimeSlot.endTime - newTimeSlot.startTime) / (1000 * 60)

    if (diffInMinutes <= 0) {
      throw next(new Errorhandler(400, 'Start time most occur before end time'))
    }

    if (diffInMinutes < 30) {
      throw next(new Errorhandler(400, 'Start and end times must be at least 30 minutes apart'))
    }

    

    // Check for conflicting timeslots
    for (let existingSlot of field.timeSlots) {
      let existingSlotStartTime = new Date(existingSlot.startTime)
      let existingSlotEndTime = new Date(existingSlot.endTime)

      if (newTimeSlot.startTime < existingSlotEndTime && newTimeSlot.endTime > existingSlotStartTime) {
        throw next(new Errorhandler(400, 'Time slot conflict. Timeslots cannot overlap'))
      }
    }
    const createdTimeSlot = await TimeSlot.create(newTimeSlot)
    
    field.timeSlots.push(createdTimeSlot)
    await field.save()

    res.status(201).json({
      status: 'success',
      data: {
        field: field
      }
    })

})

exports.bulkAddTimeSlot = catchAsync (async (req, res,next) => {
  // Get the field ID from the route parameters
  const fieldId = req.params.id;

  // Fetch the field from the database
  const field  = await Field.findById(fieldId);

  // Check if field was found
  if (!field) {
    throw next(new Errorhandler(404, 'No Field was found with this ID'));
  }

  // Retrieve startTime, endTime and duration from request body
  const {startTime: initialStartTime, endTime: finalEndTime, duration} = req.body;

  // Convert startTime and endTime into Date objects
  let startTime = new Date(initialStartTime);
  const endTime = new Date(finalEndTime);

  // Loop until startTime is less than endTime
  while (startTime < endTime) {
      // Calculate the endTime for the current timeslot
      const currentEndTime = new Date(startTime.getTime() + duration * 60000);  // duration is in minutes, so multiply by 60000 to convert to milliseconds

      // Check if the calculated endTime is after the finalEndTime
      if (currentEndTime > endTime) {
          throw next(new Errorhandler(400, 'The calculated end time of a timeslot exceeds the provided end time'));
      }

      // Create new time slot from startTime and endTime
      const newTimeSlot = {startTime, endTime: currentEndTime, field: fieldId};

      // Check for conflicting timeslots
      for (let existingSlot of field.timeSlots) {
        let existingSlotStartTime = new Date(existingSlot.startTime);
        let existingSlotEndTime = new Date(existingSlot.endTime);

        if (newTimeSlot.startTime < existingSlotEndTime && newTimeSlot.endTime > existingSlotStartTime) {
          throw next(new Errorhandler(400, 'Time slot conflict. Timeslots cannot overlap'));
        }
      }

      const createdTimeSlot = await TimeSlot.create(newTimeSlot);
      field.timeSlots.push(createdTimeSlot);

      // Advance startTime by the duration
      startTime = new Date(startTime.getTime() + duration * 60000);
  }

  await field.save();

  res.status(201).json({
    status: 'success',
    data: {
      field: field,
    },
  });
});

exports.recurringAddTimeSlot = catchAsync (async (req, res,next)=> {
  const fieldId = req.params.id

  const field = await Field.findById(fieldId)

  if (!field) {
    throw next (new Errorhandler(404, 'No field was found with this ID'))
  }

  // Retrieve startTime, endTime, and duration
  let {startTime, endTime, duration} = req.body

  // Convert startTime and endTime to Date object

  startTime = new Date(startTime)
  endTime = new Date(endTime)

  // Create a time slot for each day of the week
  for (let i = 0; i < 7; i++) {
    // Create a new date for each day, keeping the same hours and minutes
    let newStartTime = new Date(startTime)
    newStartTime.setDate(startTime.getDate() + i)
    let newEndTime = new Date(endTime)
    newEndTime.setDate(endTime.getDate() + i)
    let newDuration = duration


    // Loop until newStartTime is less than newEndTime
    while (newStartTime < newEndTime) {
      // Calculate the endTime for the current timeslot
      const currentEndTime = new Date(newStartTime.getTime() + newDuration * 60000);  // 

      // Check if the calculated endTime is after the finalEndTime
      if (currentEndTime > newEndTime) {
          throw next(new Errorhandler(400, 'The calculated end time of a timeslot exceeds the provided end time'));
      }

      // Create new time slot from newStartTime and endTime
      const newTimeSlot = {startTime: newStartTime, endTime: currentEndTime, field: fieldId};

      // Check for conflicting timeslots
      for (let existingSlot of field.timeSlots) {
        let existingSlotStartTime = new Date(existingSlot.startTime);
        let existingSlotEndTime = new Date(existingSlot.endTime);

        if (newTimeSlot.startTime < existingSlotEndTime && newTimeSlot.endTime > existingSlotStartTime) {
          throw next(new Errorhandler(400, 'Time slot conflict. Timeslots cannot overlap'));
        }
      }

      const createdTimeSlot = await TimeSlot.create(newTimeSlot);
      field.timeSlots.push(createdTimeSlot);

      // Advance newStartTime by the duration
      newStartTime = new Date(newStartTime.getTime() + newDuration * 60000);
    }
  }

  await field.save()
  res.status(201).json({
    status: 'success',
    data: {
      field: field
    }
  })
})
