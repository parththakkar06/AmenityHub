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
        console.log("here")
        const {startTime , endTime , date} = req.body
        console.log(req.body)
        const selectedAmenity = await AmenityModel.findOne({ name: req.body.amenityName })
        const amenityId = selectedAmenity._id
        console.log("Found amenity id.... ",amenityId)
        if(!startTime || !endTime || !amenityId){
            res.status(400).json({
                message : "Missing required Fields"
            })
        }

        const combinedstart = `${date}T${startTime}`
        const start = new Date(combinedstart)
        const combinedend = `${date}T${endTime}`
        const end = new Date(combinedend)
        console.log("date start..",start)
        console.log("date end..",end)

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
        console.log("overlapping .... ",overlapping)
        if(overlapping.length > 0){
            res.status(400).json({
                message : "Already Booked Time Slot."
            })
        }else{
        console.log("amenityid..",amenityId)
        console.log("userId...",req.params.id)
        console.log("startTime ... ",start)
        console.log("endTime ... ",end)
        const date1 = new Date(date)
        console.log("date",date1)
        
        const booking = await bookingModel.create({ 
            amenityId : amenityId,
            userId : req.params.id,
            startTime : start,
            endTime : end,
            date : date1,
            status : 'Pending'
        })
        
        res.status(201).json({
            message: "Booking done successfully!",
            data: booking
        })
    }
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
        // console.log(id)
        const bookings = await bookingModel.find({userId : id}).populate('amenityId','name')
        // console.log(bookings)
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