const mongoose = require('mongoose')
const Schema = mongoose.Schema


const FileModel = new Schema({
    bookingId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'bookings'
    },
    fileName : {
        type : String,
        required : true
    },
    filePath : {
        type : String,
        required : true
    },
    fileType : {
        type : String,
        required : true
    },
    fileSize : {
        type : String
    }
})


module.exports = mongoose.model('files',FileModel)