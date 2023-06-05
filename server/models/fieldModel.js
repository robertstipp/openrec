const mongoose = require('mongoose')

const {timeSlotSchema} = require('./timeSlotModel')

const fieldSchema = new mongoose.Schema({
  name: String,
  sports: [String],
  location: String,
  timeSlots: [timeSlotSchema],
  hasParking: {type: Boolean, default: true},
})
const Field = mongoose.model('Field', fieldSchema)

module.exports = Field