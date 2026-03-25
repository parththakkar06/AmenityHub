const mongoose = require('mongoose')
const Schema = mongoose.Schema


const transactionModel = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required : true
    },
    bookingId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'bookings',
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    paymentMethod : {
        type : String,
        enum : ['Card','UPI','Cash'],
        default : 'Cash'
    },
    transactionStatus : {
        type : String,
        enum : ['Success','Failed','InTransit'],
        default : 'InTransit'
    }
})



module.exports = mongoose.model("transactions",transactionModel)