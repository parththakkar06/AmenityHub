const mongoose = require('mongoose')
const Schema = mongoose.Schema


const amenityModel = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    location: {
        type: String,
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    Rules: {
        type: String
    },
    Availibility: {
        openingTime: {
            type: String,
            required: true
        },
        closingTime: {
            type: String,
            required: true
        }
    },
    capacity : {
        type : Number,
        required : true
    }
})


module.exports = mongoose.model("amenities",amenityModel)