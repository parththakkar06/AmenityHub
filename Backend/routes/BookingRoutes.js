const express = require('express')
const routes = express.Router()
const bookingController = require('../controllers/BookingController')
const authMiddleware = require("../middlewares/authMiddleware")

routes.get("/bookings",authMiddleware,bookingController.getAllBookings)
routes.post("/bookings/:id",authMiddleware,bookingController.addBookings)
routes.get('/bookings/:id',authMiddleware,bookingController.getBookingsByUserId)

module.exports = routes