const mongoose = require('mongoose')
const {fieldSchema} = require('./fieldModel')
const validator = require('validator')

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A field must have a name']
  },
  owner: {
    type: String,
    required: [true, 'A locations must have an owner']
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  
  email: {
    type: String,
    validate: [validator.isEmail, 'Please provide a valid email']
  },

  coords: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  
  address: String,
  fields : [fieldSchema]
})

locationSchema.virtual('numFields').get(function() {
  return this.fields.length
})

const Location = mongoose.model('Location',locationSchema)

module.exports = Location