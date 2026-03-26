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
    rules: [String],
    availibility: {
        openingTime: {
            type: Number,
            required: true
        },
        closingTime: {
            type: Number,
            required: true
        }
    },
    capacity: {
        type: Number,
        required: true
    }
})

amenityModel.pre('save', function (next) {
    if (this.Availibility.openingTime >= this.Availibility.closingTime) {
        return next(new Error('Opening time must be before Closing time'))
    } else {
        return next()
    }
})

module.exports = mongoose.model("amenities", amenityModel)