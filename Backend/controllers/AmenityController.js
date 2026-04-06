const amenityModel = require('../models/AmenityModel')
const BookingModel = require('../models/BookingModel')

const getAllAmenities = async (req, res) => {
    try {
        const amenities = await amenityModel.find()

        res.json({
            message: "Amenities Found!",
            data: amenities
        })
    } catch (error) {
        res.json({
            message: "error while fetching amenities",
            error: error.message
        })
    }
}

const addAmenity = async (req, res) => {
    try {
        const { openingTime, closingTime, name, description, capacity, location, rules, pricePerHour } = req.body
        let rule = rules.split(",").map(r => r.trim())
        let open = openingTime * 60
        let close = closingTime * 60
        amenity = {
            name: name,
            description: description,
            capacity: capacity,
            location: location,
            availibility: {
                openingTime: open,
                closingTime: close
            },
            rules: rule,
            pricePerHour: pricePerHour
        }
        console.log(amenity)
        const savedAmenity = await amenityModel.create(amenity)
        res.status(201).json({
            message: "Amenity Saved!",
            data: savedAmenity
        })
    } catch (error) {
        res.json({
            message: "Error while saving the amenity",
            error: error.message
        })
    }
}

const deleteAmenityById = async (req, res) => {
    try {
        const id = req.params.id
        const deletedAmenity = await amenityModel.findByIdAndDelete(id)
        await BookingModel.findByIdAndDelete(id)
        res.status(201).json({
            message: "Deleted Amenity Successfully!",
            data: deletedAmenity
        })
    } catch (error) {
        res.json({
            message: "Error while deleting amenity",
            error: error.message
        })
    }
}

const updateAmenityById = async (req, res) => {
    try {
        const id = req.params.id
        const updatedUser = await amenityModel.findByIdAndUpdate(id, req.body, { new: true })

        res.status(201).json({
            message: "Amenity Updated Successfully",
            data: updatedUser
        })
    } catch (error) {
        res.json({
            message: "Error while updating Amenity!",
            error: error.message
        })
    }
}

const getAmenityCount = async (req, res) => {
    try {
        const count = await amenityModel.countDocuments()
        res.status(200).json({
            message: "Total Amenity Count Found!",
            count: count
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!",
            error: error.message
        })
    }
}

const amenityUtilized = async (req, res) => {
    const bookings = await BookingModel.find({
        date: { $lt: new Date() },
    }).populate('amenityId', 'name').lean()

    const something = await BookingModel.aggregate([
        {
            $match: {
                status: "Accepted"
            }
        },
        {
            $lookup: {
                from: "amenities",
                localField: "amenityId",
                foreignField: "_id",
                as: "amenity"
            }
        },
        {
            $unwind: "$amenity"
        },
        {
            $addFields: {
                durationHours: {
                    $divide: [
                        { $subtract: ["$endTime", "$startTime"] },
                        1000 * 60 * 60
                    ]
                }
            }
        },
        {
            $addFields: {
                revenue: {
                    $multiply: ["$durationHours", "$amenity.pricePerHour"]
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$startTime" },
                    month: { $month: "$startTime" }
                },
                totalRevenue: { $sum: "$revenue" }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ])

    console.log(something)

    const time = bookings.map(b => ({
        ...b,
        diff: (b.endTime - b.startTime) / 3600000
    }))

    const output = {}

    time.forEach(b => {
        if (!output[b.amenityId.name]) {
            output[b.amenityId.name] = 0
        }
        output[b.amenityId.name] += b.diff
    })

    console.log(output)

    res.json({
        data: output
    })
}

module.exports = {
    getAllAmenities,
    addAmenity,
    deleteAmenityById,
    updateAmenityById,
    getAmenityCount,
    amenityUtilized
}