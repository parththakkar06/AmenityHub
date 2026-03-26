const express = require('express')
const routes = express.Router()
const bookingController = require('../controllers/BookingController')

routes.get("/bookings",bookingController.getAllBookings)
routes.post("/bookings",bookingController.addBookings)

module.exports = routes