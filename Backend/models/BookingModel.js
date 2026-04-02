const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BookingModel = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    amenityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'amenities'
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
})

// BookingModel.pre('save', function (next) {
//     if (this.startTime >= this.endTime) {
//          next(new Error('Start Time must be before the End Time'))
//     } else {
//         next()
//     }
// })

BookingModel.index({ amenityId: 1 }, { startTime: 1 }, { endTime: 1 })

module.exports = mongoose.model('bookings', BookingModel)