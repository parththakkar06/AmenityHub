const express = require('express')
const routes = express.Router()
const bookingController = require('../controllers/BookingController')

routes.get("/bookings",bookingController.getAllBookings)

module.exports = routes