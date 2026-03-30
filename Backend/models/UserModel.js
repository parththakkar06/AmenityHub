const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userModel = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        required: true
    },
    // passUpdation: {
    //     updatedDate: {
    //         type: Date,
    //         required: true
    //     },
    //     expiryDate: {
    //         type: Date,
    //         required: true
    //     }
    // },
    passwordChangedAt: {
        type: Date,
        required: true
    },
    address: {
        blockNo: {
            type: String,
        },
        flatNo: {
            type: String,
        }
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("users", userModel)