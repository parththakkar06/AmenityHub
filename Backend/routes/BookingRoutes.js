const express = require('express')
const routes = express.Router()
const bookingController = require('../controllers/BookingController')
const authMiddleware = require("../middlewares/authMiddleware")

routes.get("/bookings",authMiddleware,bookingController.getAllBookings)
routes.post("/bookings/:id",authMiddleware,bookingController.addBookings)
routes.get('/bookings/:id',authMiddleware,bookingController.getBookingsByUserId)
routes.get('/pastbookings/:id',authMiddleware,bookingController.getPastBookingsByUserId)
routes.get("/getbookingscount",authMiddleware,bookingController.getBookingsCount)
routes.get("/getrevenue",authMiddleware,bookingController.getRevenue)


module.exports = routes