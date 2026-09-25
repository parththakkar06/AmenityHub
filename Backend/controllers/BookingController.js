const AmenityModel = require('../models/AmenityModel')
const bookingModel = require('../models/BookingModel')
const userModel = require('../models/UserModel')
const transactionModel = require('../models/TransactionsModel')
const mail = require('../utils/MailUtil')


const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find().populate('amenityId', 'name').populate('userId', 'name address.blockNo address.flatNo')

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
        const bookings = await bookingModel.find({ status: "Accepted" }).countDocuments()

        res.status(201).json({ bookings })
    } catch (error) {
        res.json({
            message: "Error occured while fetching accepted bookings",
            error: error.message
        })
    }
}

const getAllRejectedBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({ status: "Rejected" }).countDocuments()

        res.status(201).json({
            data: bookings
        })
    } catch (error) {
        res.json({
            message: "Error occured while fetching pending bookings",
            error: error.message
        })
    }
}


const getAllPendingBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({ status: "Pending" }).countDocuments()
        res.status(201).json({
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
        const { startTime, endTime, bookingAmount, date, residentsCount, guestsCount, paymentMethod } = req.body
        console.log(req.body)
        const numResidents = Number(residentsCount) > 0 ? Number(residentsCount) : 1
        const numGuests = Number(guestsCount) >= 0 ? Number(guestsCount) : 0
        const method = (paymentMethod && ['UPI', 'Card', 'Cash'].includes(paymentMethod)) ? paymentMethod : 'UPI'

        if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'null') {
            return res.status(400).json({
                message: "User session expired. Please log in again to book."
            })
        }

        let selectedAmenity = null
        if (req.body.amenityName?._id) {
            selectedAmenity = await AmenityModel.findById(req.body.amenityName._id)
        }
        if (!selectedAmenity && req.body.amenityName?.name) {
            selectedAmenity = await AmenityModel.findOne({ name: req.body.amenityName.name })
        }
        if (!selectedAmenity && typeof req.body.amenityName === 'string') {
            selectedAmenity = await AmenityModel.findOne({ name: req.body.amenityName })
        }

        if (!selectedAmenity) {
            return res.status(404).json({
                message: "Selected amenity could not be found. Please select an amenity from the list."
            })
        }

        const amenityId = selectedAmenity._id
        console.log("Found amenity id.... ", amenityId)


        const combinedstart = `${date}T${startTime}`
        const start = new Date(combinedstart)
        const combinedend = `${date}T${endTime}`
        const end = new Date(combinedend)
        console.log("date start..", start)
        console.log("date end..", end)
        const today = new Date()


        const openingTime = selectedAmenity.availibility?.openingTime ?? 360
        const closingTime = selectedAmenity.availibility?.closingTime ?? 1320

        const check_s = start.getHours() * 60 + start.getMinutes()
        const check_e = end.getHours() * 60 + end.getMinutes()



        const overlapping = await bookingModel.find({
            amenityId: amenityId,
            status: { $ne: "Rejected" },
            $and: [
                { startTime: { $lte: end } },
                { endTime: { $gte: start } }
            ]
        })
        console.log("overlapping .... ", overlapping)

        if (!startTime || !endTime || !amenityId) {
            console.log("PROBLEM FOUND")
            res.status(400).json({
                message: "Missing required Fields"
            })
        } else if (start >= end) {
            res.status(400).json({
                message: "Invalid Time Range"
            })
        } else if (start < today) {
            res.status(400).json({
                message: "Check the booking again!"
            })
        } else if (check_s < openingTime || check_e > closingTime) {
            res.status(400).json({
                message: `Can not book before the opening timings of the ${selectedAmenity.name}`
            })
        } else if (overlapping.length > 0) {
            res.status(400).json({
                message: "Already Booked Time Slot."
            })
        } else {


            console.log("amenityid..", amenityId)
            console.log("userId...", req.params.id)
            console.log("startTime ... ", start)
            console.log("endTime ... ", end)
            const date1 = new Date(date)
            console.log("date", date1)

            const booking = await bookingModel.create({
                amenityId: amenityId,
                userId: req.params.id,
                startTime: start,
                endTime: end,
                date: date1,
                bookingAmount: bookingAmount,
                residentsCount: numResidents,
                guestsCount: numGuests,
                paymentMethod: method,
                paymentStatus: 'Paid',
                status: 'Pending'
            })

            // Create genuine transaction record linked to this booking
            const transaction = await transactionModel.create({
                userId: req.params.id,
                bookingId: booking._id,
                amount: bookingAmount,
                paymentMethod: method,
                transactionStatus: 'Success'
            })

            res.status(201).json({
                message: "Booking and payment completed successfully!",
                data: {
                    booking,
                    transaction
                }
            })

        }

    } catch (error) {
        console.error("Booking error:", error)
        res.status(500).json({
            message: "Error while booking: " + error.message,
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
            error: error.message
        })
    }
}

const getBookingsByUserId = async (req, res) => {
    try {
        const today = new Date()
        const id = req.params.id
        // console.log(id)
        // console.log(today)
        const bookings = await bookingModel.find({ userId: id, endTime: { $gte: today } }).populate('amenityId', 'name').sort({ date: 1, startTime: 1 })
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
            message: "bookings Found!",
            data: bookings
        })
    } catch (error) {
        res.json({
            message: "Error while finding booking for user",
            error: error.message
        })
    }
}

const getPastBookingsByUserId = async (req, res) => {
    try {
        const id = req.params.id
        const today = new Date()
        const bookings = await bookingModel.find({ userId: id, startTime: { $lt: today } }).populate('amenityId', 'name')

        if (bookings) {
            res.status(200).json({
                message: "Past Bookings Found",
                data: bookings
            })
        }

    } catch (error) {
        res.status(400).json({
            message: "Something went wrong!",
            error: error.message
        })
    }
}

const getBookingsCount = async (req, res) => {
    try {
        const count = await bookingModel.countDocuments()
        res.status(200).json({ count })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        })
    }
}

const getRevenue = async (req, res) => {
    try {
        let Revenue = 0
        const booking = await bookingModel.find({status : 'Accepted'})
        for (b of booking) {
            console.log(b.bookingAmount)
            Revenue += b.bookingAmount
        }
        console.log(Revenue)
        res.status(200).json({ Revenue })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

const getRevenueByAmenity = async (req, res) => {
    try {
        const revenue = await bookingModel.aggregate([
            {
                $match : {
                    status : 'Accepted'
                }
            },
            {
                $group:
                {
                    _id: '$amenityId',
                    totalRevenue: { $sum: '$bookingAmount' },
                    totalBookings: { $sum: 1 }
                }
            },
            {
                $lookup:
                {
                    from: 'amenities',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'amenity'
                }
            },
            {
                $unwind: '$amenity'
            },
            {
                $project: 
                {
                    _id : 0,
                    amenityName : '$amenity.name',
                    totalRevenue : 1,
                    totalBookings : 1
                }
            }
        ])
        res.status(200).json({
            revenue: revenue
        })
        console.log(revenue)
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

const statusChange = async(req,res) => {
    try {
        const id = req.params.id
        if (req.body.cancelReason && !req.body.rejectionReason) {
            req.body.rejectionReason = req.body.cancelReason
        }
        if (req.body.rejectionReason && !req.body.cancelReason) {
            req.body.cancelReason = req.body.rejectionReason
        }
        const book = await bookingModel.findByIdAndUpdate(id,req.body,{new : true})
        const user = await bookingModel.findOne({_id : id}).populate('userId','email').populate('amenityId','name')
        res.status(200).json({
            message : "status changed successfully",
            data : book
        })

        if (user && user.userId && user.userId.email) {
            const startH = user.startTime.getHours()
            const startM = user.startTime.getMinutes()
            const endH = user.endTime.getHours()
            const endM = user.endTime.getMinutes()
            const start = `${startH}:${startM === 0 ? "00" : (startM < 10 ? '0' + startM : startM)}`
            const end = `${endH}:${endM === 0 ? "00" : (endM < 10 ? '0' + endM : endM)}`
            const amenityName = user.amenityId?.name || 'Amenity'

            const isRejected = (req.body.status && req.body.status.toLowerCase() === 'rejected') || (book && book.status === 'Rejected');
            console.log(`[statusChange] Booking ${id} status set to: ${book.status}. isRejected: ${isRejected}`);

            if (isRejected) {
                const attendeesInfo = `${book.residentsCount || 1} Resident(s)${book.guestsCount ? `, ${book.guestsCount} Guest(s)` : ''}`
                const cancelReason = req.body.cancelReason || req.body.rejectionReason || book.cancelReason || book.rejectionReason || 'No specific reason provided'
                const subject = 'Your Booking Request has been Rejected'
                const text = `
                <h2>Your Booking request has been rejected.</h2>
                <p>We regret to inform you that your amenity reservation could not be approved.</p>
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
                    <strong style="color: #991b1b;">Reason for Cancellation:</strong>
                    <p style="color: #7f1d1d; margin: 4px 0 0 0;">${cancelReason}</p>
                </div>
                <h3>Reservation Details:</h3>
                <p>
                <strong>Booking ID:</strong> ${id}<br>
                <strong>Amenity:</strong> ${amenityName}<br>
                <strong>Date:</strong> ${new Date(user.date).toLocaleDateString()}<br>
                <strong>Time Slot:</strong> ${start} to ${end}<br>
                <strong>Attendees:</strong> ${attendeesInfo}<br>
                <strong>Total Amount:</strong> ₹${book.bookingAmount}
                </p>
                `
                console.log(`[statusChange] Sending rejection mail to ${user.userId.email} with reason: ${cancelReason}`);
                mail.mailSend(user.userId.email, subject, text)
            } else {
                const attendeesInfo = `${book.residentsCount || 1} Resident(s)${book.guestsCount ? `, ${book.guestsCount} Guest(s)` : ''}`
                const subject = 'Your Booking has been Confirmed!'
                const text = `
                <h2>Your Booking is confirmed. Check the details below!</h2>
                <h3>Booking Id : ${id}<br><br>
                Amenity Name : ${amenityName}<br><br>
                Date : ${user.date}<br><br>
                Time Slot : ${start} to ${end}<br><br>
                Attendees : ${attendeesInfo}<br><br>
                Total Amount : ₹${book.bookingAmount}</h3>
                `
                console.log(`[statusChange] Sending confirmation mail to ${user.userId.email}`);
                mail.mailSend(user.userId.email, subject, text)
            }
        }
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong!",
            error : error.message
        })
    }
}


module.exports = {
    getRevenue,
    getAllBookings,
    addBookings,
    updateBookings,
    getAllAcceptedBookings,
    getAllRejectedBookings,
    getBookingsByUserId,
    getPastBookingsByUserId,
    getBookingsCount,
    getRevenueByAmenity,
    statusChange,
    getAllPendingBookings
}