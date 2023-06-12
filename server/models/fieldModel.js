const mongoose = require('mongoose')
const {timeSlotSchema} = require('./timeSlotModel')

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A field must have a name'],
  },
  sports: [String],

  // TODO - Determine if we are going to attach the field Name here
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'A field must have a location']
  },
  timeSlots: [timeSlotSchema],
  hasParking: {type: Boolean, default: true},
})

fieldSchema.statics.isNameInUse = async function (name) {
  const field = await this.findOne({name})
  return field ? true : false
}

const Field = mongoose.model('Field', fieldSchema)

module.exports = {Field, fieldSchema}