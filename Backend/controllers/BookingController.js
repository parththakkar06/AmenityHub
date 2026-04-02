const AmenityModel = require('../models/AmenityModel')
const bookingModel = require('../models/BookingModel')
const userModel = require('../models/UserModel')


const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find().populate('amenityId','name').populate('userId','name')

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
        const {startTime , endTime , bookingAmount , date} = req.body
        console.log(req.body)
        const selectedAmenity = await AmenityModel.findOne({ name: req.body.amenityName.name })
        const amenityId = selectedAmenity._id
        console.log("Found amenity id.... ",amenityId)
        

        const combinedstart = `${date}T${startTime}`
        const start = new Date(combinedstart)
        const combinedend = `${date}T${endTime}`
        const end = new Date(combinedend)
        console.log("date start..",start)
        console.log("date end..",end)
        const today = new Date()
        

        const openingTime = selectedAmenity.availibility.openingTime 
        const closingTime = selectedAmenity.availibility.closingTime 

        const check_s = start.getHours() * 60 + start.getMinutes() 
        const check_e = end.getHours() * 60 + end.getMinutes()

        

        const overlapping = await bookingModel.find({
            amenityId : amenityId,
            status : {$ne : "Rejected"},
            $and : [
                { startTime : { $lte : end} },
                { endTime : {$gte : start} }
            ]
        })
        console.log("overlapping .... ",overlapping)

        if(!startTime || !endTime || !amenityId){
            console.log("PROBLEM FOUND")
            res.status(400).json({
                message : "Missing required Fields"
            })
        }else if(start >= end){
            res.status(400).json({
                message : "Invalid Time Range"
            })
        }else if(start < today){
            res.status(400).json({
                message : "Check the booking again!"
            })
        }else if(check_s < openingTime || check_e > closingTime){
            res.status(400).json({
                message : `Can not book before the opening timings of the ${selectedAmenity.name}`
            })
        }else if(overlapping.length > 0){
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
            bookingAmount : bookingAmount,
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
        const today = new Date()
        const id = req.params.id
        // console.log(id)
        // console.log(today)
        const bookings = await bookingModel.find({userId : id,endTime : {$gte : today}}).populate('amenityId','name').sort({date:1,startTime:1})
        // console.log(bookings)
        // let newBookings = []
        // for(b of bookings){
        //     console.log(b.endTime)
        //    if(b.endTime <= today){
        //      newBookings.push(b)
        //    } 
        // }
        // console.log(newBookings)
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

const getPastBookingsByUserId = async(req,res) => {
    try {
    const id = req.params.id
    const today = new Date()
    const bookings = await bookingModel.find({userId : id , startTime : {$lt : today}}).populate('amenityId','name')
    
    if(bookings){
        res.status(200).json({
            message : "Past Bookings Found",
            data : bookings
        })
    }

    } catch (error) {
        res.status(400).json({
            message : "Something went wrong!",
            error : error.message
        })
    }
}

const getBookingsCount = async(req,res) => {
    try {
        const count = await bookingModel.countDocuments()
        res.status(200).json({count})
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong!"
        })
    }
}

const getRevenue = async(req,res) => {
    try {
        let Revenue = 0
        const booking = await bookingModel.find()
        for(b of booking){
            console.log(b.bookingAmount)
            Revenue += b.bookingAmount
        }
        console.log(Revenue)
        res.status(200).json({Revenue})
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong!"
        })
    }
}

module.exports = {
    getRevenue,
    getAllBookings,
    addBookings,
    updateBookings,
    getAllAcceptedBookings,
    getAllPendingBookings,
    getBookingsByUserId,
    getPastBookingsByUserId,
    getBookingsCount
}