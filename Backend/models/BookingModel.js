const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BookingModel = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    amenityId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'amenities'
    },
    date : {
        type : Date,
        required : true
    },
    startTime : {
        type : String,
        required : true
    },
    endTime : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['Pending','Accepted','Rejected'],
        default : 'Pending'
    },
    rejectionReason : {
        type : String
    }
},{
    timestamps : true
})


module.exports = mongoose.Schema('bookings',BookingModel)