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
routes.get("/approvedcount",authMiddleware,bookingController.getAllAcceptedBookings)
routes.get("/rejectedcount",authMiddleware,bookingController.getAllRejectedBookings)
routes.get("/revenuebyamenity",authMiddleware,bookingController.getRevenueByAmenity)
routes.put('/status/:id',authMiddleware,bookingController.statusChange)
routes.get("/pendingcount",authMiddleware,bookingController.getAllPendingBookings)

module.exports = routes