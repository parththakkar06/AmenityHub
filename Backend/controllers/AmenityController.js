const amenityModel = require('../models/AmenityModel')

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
        const savedAmenity = await amenityModel.create(req.body)
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

        res.status(201).json({
            message: "Deleted Amenity Successfully!",
            data: deletedAmenity
        })
    } catch (error) {
        res.json({
            message : "Error while deleting amenity",
            error : error.message
        })
    }
}

const updateAmenityById = async(req,res) => {
    try {
        const id = req.params.id
        const updatedUser = await amenityModel.findByIdAndUpdate(id,req.body,{new:true})

        res.status(201).json({
            message : "Amenity Updated Successfully",
            data : updatedUser
        })
    } catch (error) {
        res.json({
            message : "Error while updating Amenity!",
            error : error.message
        })
    }
}

const getAmenityCount = async(req,res) => {
    try {
        const count = await amenityModel.countDocuments()
        res.status(200).json({
            message : "Total Amenity Count Found!",
            count : count
        })
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong!",
            error : error.message
        })
    }
}

module.exports = {
    getAllAmenities,
    addAmenity,
    deleteAmenityById,
    updateAmenityById,
    getAmenityCount
}