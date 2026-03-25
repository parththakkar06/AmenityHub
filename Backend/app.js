const express = require("express")
const { default: mongoose } = require("mongoose")
const app = express()
const uri = 'mongodb://127.0.0.1:27017/amenityHub'

app.use(express.json())


const roleRoutes = require('./routes/RoleRoutes')
app.use('/role',roleRoutes)

const userRoutes = require('./routes/UserRoutes')
app.use('/user',userRoutes)

const amenityRoutes = require('./routes/AmenitiesRoutes')
app.use('/amenity',amenityRoutes)

const fileRoutes = require("./routes/FileRoutes")
app.use('/file',fileRoutes)

const transactionRoutes = require('./routes/TransactionsRoutes')
app.use('/transaction',transactionRoutes)

const bookingRoutes = require('./routes/BookingRoutes')
app.use('/booking',bookingRoutes)

const connectDb = async()=>{
    try {
        await mongoose.connect(uri)
        console.log("Database Connected Successfully")
    } catch (error) {
        console.error("Error ... ",error.message)
    }
}

connectDb()
const PORT = 3000
app.listen(PORT , ()=>{
    console.log("Server running on port ....",PORT)
})