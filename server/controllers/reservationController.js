const Field = require('../models/fieldModel')
const Reservation = require('../models/reservationModel')


exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()

    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: {
        reservations
      }
    })

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getReservation = async (req,res) => {
  const reservation = await Reservation.findById(req.params.id)

  if (!reservation) {
    return res.status(404).json({
      status: 'fail',
      message: 'Reservation not found'
    })
  }

  res.status(201).json({
    status: 'success',
    data: {
      reservation: reservation
    }
  })
}

exports.createReservation =  async (req,res) => {
  try {
    const {timeSlotId,fieldId} = req.body

    // Find the field
    const field = await Field.findById(fieldId)

    if (!field) {
      return res.status(404).json({
        status: 'fail',
        message: 'Field not found'
      })
    }


    // Find the timeSlot within the field
    const timeSlot = await field.timeSlots.id(timeSlotId)

    if (!timeSlot) {
      res.status(404).json({
        status: 'fail',
        message: 'Time slot not found'
      })
      return
    }

    if (timeSlot.isReserved) {
      res.status(400).json({
        status: 'fail',
        message: 'Time slot is already reserved'
      })
      return
    }

    // If the time slot is not reserved, then reserve it
    timeSlot.isReserved = true;
    await field.save()

    // Create the reservation
    const newReservation = await Reservation.create({
      field: fieldId,
      timeSlot: timeSlotId,
      user: req.body.user
    })

    res.status(201).json({
      status: 'success',
      data: {
        reservation: newReservation
      }
    })
  } catch (err) {
    res.status(404).json({
      status:'fail',
      message: 'failed at the bottom'
    })
  }
}

exports.deleteReservation = async (req,res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('field')
    
    
    if (!reservation) {
      return res.status(404).json({
        status: 'fail',
        message: 'Reservation not found'
      })
    }

    // Find the Field within the reservation
    const field = await Field.findById(reservation.field._id);
    if (!field) {
      return res.status(404).json({
        status: 'fail',
        message: 'Field not found'
      })
    }

    // Find the timeSlot within the field

    const timeSlot = await field.timeSlots.id(reservation.timeSlot)

    if (!timeSlot) {
      res.status(404).json({
        status: 'fail',
        message: 'Time slot not found'
      })
    }

    timeSlot.isReserved = false;
    await field.save()

    // Delete the reservation
    await Reservation.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data : null
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    })
  }
}