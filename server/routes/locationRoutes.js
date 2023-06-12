const express = require('express')
const locationController = require('./../controllers/locationController')

const router = express.Router()

router
  .route('/')
  .get(locationController.getAllLocations)
  .post(locationController.createLocation)

router
  .route('/:locationId')
  .get(locationController.getLocation)
  .delete(locationController.deleteLocation)

router 
  .route('/:locationId/fields')
  .post(locationController.createField)

module.exports = router