const fileModel = require('../models/FileModel')

const getAllFiles = async(req,res) => {
    try {
        const files = await fileModel.find()
        
        res.status(201).json({
            message : "files fetched!",
            data : files
        })
    } catch (error) {
        res.json({
            message : "Error while fetching files!",
            error : error.message
        })
    }
}

module.exports = {
    getAllFiles
}