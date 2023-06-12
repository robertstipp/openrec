const Location = require('../models/locationModel')

const {Errorhandler} = require('./errorController')
const catchAsync = require('../utils/catchAsync')
const { Field } = require('../models/fieldModel')

exports.getAllLocations = catchAsync(async (req,res,next) => {
  const locations = await Location.find()

  if (locations.length === 0 ) {
    throw next(new Errorhandler(400,'No locations found'))
  }
  res.status(200).json({
    status: 'success',
    data: {
      locations
    }
  })
})

exports.createLocation = catchAsync(async(req,res,next)=>{


  const newLocation = await Location.create(req.body)




  res.status(200).json({
    status: 'success',
    data : {
      newLocation
    }
  })
})

exports.createField = catchAsync(async (req,res,next)=> {
  const {locationId} = req.params
  const location = await Location.findById(locationId).populate('fields')
  if (!location) {
    throw next(new Errorhandler(400, 'No location was found with this ID'))
  }

  if (location.fields.some(field => field.name === req.body.name)) {
    throw next(new Errorhandler(400, 'Field with this name already exists'));
}
  const newField = await Field.create({...req.body, location: locationId})
  
  location.fields.push(newField)
  await location.save()
  

  res.status(201).json({
    status: 'success',
    data: {
      location: location
    }
  })
})




exports.getLocation = catchAsync(async (req,res,next)=> {
  const {locationId} = req.params
  const location = await Location.findById(locationId).populate('fields')
  if (!location) {
    throw next(new Errorhandler(400, 'No location was found with this ID'))
  }

  res.status(200).json({
    status: 'success',
    data: {
      location
    }
  })

})

exports.deleteLocation = catchAsync(async (req,res,next)=>{
  const {locationId} = req.params
  const location = await Location.findById(locationId)
  if (!location) {
    throw next(new Errorhandler(400, 'No location was found with this ID'))
  }

  await Location.findByIdAndDelete(locationId)

  res.status(204).json({
    status: 'success',
    data: null
  })

})