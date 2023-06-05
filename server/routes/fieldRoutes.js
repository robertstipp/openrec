const express = require('express')
const fieldController = require('./../controllers/fieldController')


const router = express.Router()

router
  .route('/')
  .get(fieldController.getAllFields)
  .post(fieldController.createField)

router
  .route('/:id/timeslots')
  .post(fieldController.addTimeSlot)

router
  .route('/timeslots')
  .get(fieldController.getTimeSlots)

router
  .route('/:id')
  .get(fieldController.getField)
  .delete(fieldController.deleteField)

router
  .route('/date/:date')
  .get(fieldController.getTimeSlotsForDay)

  module.exports = router