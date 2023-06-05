const mongoose = require('mongoose')

const timeSlotSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  field: {type: mongoose.Schema.Types.ObjectId, ref: 'Field'},
  isReserved: { type: Boolean, default: false}
})
const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema)

module.exports = {TimeSlot, timeSlotSchema}