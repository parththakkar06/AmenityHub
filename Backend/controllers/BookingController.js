const AmenityModel = require('../models/AmenityModel')
const bookingModel = require('../models/BookingModel')

const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find()

        res.status(201).json({
            message: "All bookings fetched successfully",
            data: bookings
        })
    } catch (error) {
        res.json({
            message: "Error occured while fetching bookings",
            error: error.message
        })
    }
}

const addBookings = async (req, res) => {
    try {
        const selectedAmenity = await AmenityModel.findOne({ name: req.amenityName })
        const amenityId = selectedAmenity._id

        const booking = await bookingModel.create({ ...req.body, amenityId: amenityId, userId: req.user.id })

        res.status(201).json({
            message: "Booking done successfully!",
            data: booking
        })
    } catch (error) {
        res.json({
            message: "Error while booking",
            error: error.message
        })
    }
}

const updateBookings = async (req, res) => {
    try {
        const id = req.params.id
        const updatedBooking = await bookingModel.findByIdAndUpdate(id, req.body, { new: true })

        res.status(201).json({
            message: "Booking Updated!",
            data: updatedBooking
        })
    } catch (error) {
        res.json({
            message: "Error while updating booking",
            error : error.message
        })
    }
}

module.exports = {
    getAllBookings,
    addBookings
}