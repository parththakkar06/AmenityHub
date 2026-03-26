const mongoose = require('mongoose')
const Schema = mongoose.Schema


const roleModel = new Schema({
    role: {
        type: String,
        unique: true,
        enum: ['USER', 'ADMIN']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("role", roleModel)