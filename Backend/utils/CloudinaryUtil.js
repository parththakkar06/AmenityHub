const cloudinary = require('cloudinary')

const uploadToCloud = async(path) => {
    cloudinary.config({
        api_key : "228139221227862",
        cloud_name : "dbqv6jqyh",
        api_secret : "UBvXttGJCvKqKma31X726ZPr3dI"
    })

    const cloudinaryResponse = await cloudinary.uploader.upload(path)
    return cloudinaryResponse
}

module.exports = uploadToCloud