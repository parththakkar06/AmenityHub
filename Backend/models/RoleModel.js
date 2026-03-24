const mongoose = require('mongoose')
const Schema = mongoose.Schema


const roleModel = new Schema({
    role : {
        type : String
    }
},{
    timestamps : true
})

module.exports = mongoose.model("role",roleModel)