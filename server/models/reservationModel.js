const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
  user: String,
  reservedAt: {type: Date, default: Date.now},
  field: {type: mongoose.Schema.Types.ObjectId, ref: 'Field'},
  timeSlot: {type: mongoose.Schema.Types.ObjectId, ref: 'TimeSlot'}
})
const Reservation = mongoose.model('Reservation',reservationSchema)

module.exports = Reservation