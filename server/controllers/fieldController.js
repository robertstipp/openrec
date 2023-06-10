const Field = require('../models/fieldModel')
const { TimeSlot } = require('../models/timeSlotModel')
const {ErrorHandler} = require('./errorController')

exports.getAllFields = async (req,res) => {
  try {

    const {sports, hasParking, hasAvailable} = req.query

    // Construct a filter object from the query paramters
    let filter = {}
    if (sports !== undefined) {

      let sportsArray = sports.split(",")

      filter.sports = { $all : sportsArray}
    }
    if (hasParking !== undefined) {
      filter.hasParking = (hasParking === 'true')
    }

    let fields = await Field.find(filter)

    if (hasAvailable !== undefined && hasAvailable === 'true') {
      fields = fields.filter(field=>field.timeSlots.some(timeSlot=>timeSlot.isReserved === false))
    }


    // Send Response
    res.status(200).json({
      status: 'success',
      results: fields.length,
      data: {
        fields
      }
    })
  } catch (err) {
    res.status(404).json({
      status:'fail',
      message: err
    })
  }
}

exports.getField = async (req,res,next) => {
  try {
    const field = await Field.findById(req.params.id)
    
    if (!field) {
      throw new ErrorHandler(500, 'Internal Error')
    }
    res.status(200).json({
      status: 'success',
      data: {
        field
      }
    })

  } catch (err) {
    next(err)
  }
}

exports.getTimeSlots = async (req,res) => {
  try {

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

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTimeSlotsForDay = async (req,res) => {
  try {
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
    res.status(200).json({
      status: 'success',
      data: {
        timeSlots: timeSlots
      }
    })

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.createField = async (req,res) => {
  try {
    
    const newField = await Field.create(req.body)
    res.status(200).json({
      status: 'success',
      data: {
        newField
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.deleteField = async (req,res) => {
  try {
    const field = await Field.findById(req.params.id)

    if (!field) {
      res.status(404).json({
        status: 'fail',
        message: 'Field not found'
      })
      return
    }

    await Field.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.addTimeSlot = async (req,res) => {
  try {
    // Get the field ID from the route parameters
    const fieldId = req.params.id
    
    // Fetch the field from the database
    const field  = await Field.findById(fieldId)

    // Check if field was found
    if (!field) {
      res.status(404).json({
        status: 'fail',
        message: 'Field not found'
      })
      return
    }


    
    // Create new time slot from request body
    const newTimeSlot = {...req.body, field: fieldId}
    newTimeSlot.startTime = new Date(newTimeSlot.startTime)
    newTimeSlot.endTime = new Date(newTimeSlot.endTime)

    // Check for conflicting timeslots
    for (let existingSlot of field.timeSlots) {
      let existingSlotStartTime = new Date(existingSlot.startTime)
      let existingSlotEndTime = new Date(existingSlot.endTime)

      if (newTimeSlot.startTime < existingSlotEndTime && newTimeSlot.endTime > existingSlotStartTime)
        return res.status(400).json({
          status: 'fail',
          message: 'Time slot conflict'
        })
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}