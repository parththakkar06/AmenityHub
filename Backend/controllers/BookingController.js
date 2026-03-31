const AmenityModel = require('../models/AmenityModel')
const bookingModel = require('../models/BookingModel')

const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find().populate('userId','name email').populate('amenityId','name')

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

const getAllAcceptedBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({status : "Accepted"})

        res.status(201).json({
            message: "All Accepted bookings fetched successfully",
            data: bookings
        })
    } catch (error) {
        res.json({
            message: "Error occured while fetching accepted bookings",
            error: error.message
        })
    }
}

const getAllPendingBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({status : "Pending"})

        res.status(201).json({
            message: "All Pending bookings fetched successfully",
            data: bookings
        })
    } catch (error) {
        res.json({
            message: "Error occured while fetching pending bookings",
            error: error.message
        })
    }
}

const addBookings = async (req, res) => {
    try {
        const {startTime , endTime} = req.body
        const selectedAmenity = await AmenityModel.findOne({ name: req.body.amenityName })
        const amenityId = selectedAmenity._id

        if(!startTime || !endTime || !amenityId){
            res.status(400).json({
                message : "Missing required Fields"
            })
        }

        const start = new Date(startTime)
        const end = new Date(endTime)

        if(start >= end){
            res.status(400).json({
                message : "Invalid Time Range"
            })
        }

        const openingTime = selectedAmenity.availibility.openingTime 
        const closingTime = selectedAmenity.availibility.closingTime 

        const check_s = start.getHours() * 60 + start.getMinutes() 
        const check_e = end.getHours() * 60 + end.getMinutes()

        if(check_s < openingTime || check_e > closingTime){
            res.status(400).json({
                message : `Can not book before the opening timings of the ${selectedAmenity.name}`
            })
        }

        const overlapping = await bookingModel.find({
            amenityId : amenityId,
            status : {$ne : "Rejected"},
            $and : [
                { startTime : { $lte : end} },
                { endTime : {$gte : start} }
            ]
        })

        if(overlapping){
            res.status(400).json({
                message : "Already Booked Time Slot."
            })
        }

        const booking = await bookingModel.create({ ...req.body,
            amenityId : amenityId,
            userId : req.user.id,
            startTime : start,
            endTime : end
        })

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

const getBookingsByUserId = async(req,res) => {
    try {
        const id = req.params.id
        const bookings = await bookingModel.findById(id)

        res.status(201).json({
            message : "bookings Found!",
            data : bookings
        })
    } catch (error) {
        res.json({
            message : "Error while finding booking for user",
            error : error.message
        })
    }
}

module.exports = {
    getAllBookings,
    addBookings,
    updateBookings,
    getAllAcceptedBookings,
    getAllPendingBookings,
    getBookingsByUserId
}