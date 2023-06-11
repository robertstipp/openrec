const Location = require('../models/locationModel')

const {Errorhandler} = require('./errorController')
const catchAsync = require('../utils/catchAsync')

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