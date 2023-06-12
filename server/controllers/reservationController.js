const {Field} = require('../models/fieldModel')
const {TimeSlot} = require('../models/timeSlotModel')
const Reservation = require('../models/reservationModel')
const catchAsync = require('../utils/catchAsync')
const { Errorhandler } = require('./errorController')



exports.getAllReservations = catchAsync(async (req, res) => {
    const reservations = await Reservation.find()
    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: {
        reservations
      }
    })

})

exports.getReservation = catchAsync(async (req,res,next) => {

  
  const reservation = await Reservation.findById(req.params.id)

  if (!reservation) {
    throw next(new Errorhandler(404, 'No Reservation found with this ID'))
  }

  res.status(201).json({
    status: 'success',
    data: {
      reservation: reservation
    }
  })
})


// TODO - REFACTOR BECAUSE YOU CAN ACCESS THE TIMESLOT DIRECTLY

exports.createReservation = catchAsync(async (req,res,next) => {
    const {timeSlotId} = req.body

    if (!timeSlotId) {
      throw next(new Errorhandler(400, 'TimeslotId must be provided'))
    }

    
    const timeSlot = await TimeSlot.findById(timeSlotId)

    if (!timeSlot) {
      throw next(new Errorhandler(400, 'No timeslot was found with this ID'))
    }

    if (timeSlot.isReserved) {
      throw next(new Errorhandler(409, 'Timeslot is already reserved'))
    }

    const {fieldId, locationId} = timeSlot

    timeSlot.isReserved = true;
    await timeSlot.save()

    // Create the reservation
    const newReservation = await Reservation.create({
      user: req.body.user,
      field: fieldId,
      location: locationId,
      timeSlot: timeSlotId
    })


    res.status(200).json({
      status: 'success',
      data: {
        reservation: newReservation
      }
    })
})
// exports.createReservation =  catchAsync(async (req,res,next) => {
//     const {timeSlotId,fieldId} = req.body

//     if (!timeSlotId || !fieldId) {
//       throw next(new Errorhandler(400, 'Both timeSlotId and fieldId must be provided'))
//     }

//     // Find the field
//     const field = await Field.findById(fieldId)
    
//     if (!field) {
//       throw next(new Errorhandler(404, 'No Field was found with this ID'))
//     }


//     // Find the timeSlot within the field
//     const timeSlot = await field.timeSlots.findById(timeSlotId)

//     if (!timeSlot) {
//       throw next(new Errorhandler(400, 'No Timeslot was found with this ID'))
//     }

//     if (timeSlot.isReserved) {
//       throw next(new Errorhandler(409, 'Timeslot is already reserved'))
//     }

//     // If the time slot is not reserved, then reserve it
//     timeSlot.isReserved = true;
//     await field.save()

//     // Create the reservation
//     const newReservation = await Reservation.create({
//       field: fieldId,
//       timeSlot: timeSlotId,
//       user: req.body.user
//     })

//     res.status(201).json({
//       status: 'success',
//       data: {
//         reservation: newReservation
//       }
//     })
  
// })


exports.deleteReservation = catchAsync(async (req,res) => {
  

    const reservation = await Reservation.findById(req.params.id).populate('field')
    

    if (!reservation) {
      throw next(new Errorhandler(404, 'No Reservation found with this ID'))
    }

    // Find the Field within the reservation
    const field = await Field.findById(reservation.field._id);


    if (!field) {
      throw next(new Errorhandler(404, 'No Field was found with this ID'))
    }

    // Find the timeSlot within the field

    const timeSlot = await field.timeSlots.id(reservation.timeSlot)


    
    if (!timeSlot) {
      throw next(new Errorhandler(400, 'No Timeslot was found with this ID'))
    }

    timeSlot.isReserved = false;
    await field.save()

    // Delete the reservation
    await Reservation.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data : null
    })
  
})