const express = require('express')
const routes = express.Router()
const amenityController = require('../controllers/AmenityController')
const authMiddleware = require('../middlewares/authMiddleware')

routes.get("/amenities",authMiddleware,amenityController.getAllAmenities)
routes.post("/amenities",authMiddleware,amenityController.addAmenity)
routes.delete("/amenities/:id",authMiddleware,amenityController.deleteAmenityById)
routes.put("/amenities/:id",authMiddleware,amenityController.updateAmenityById)
routes.get("/getamenitycount",authMiddleware,amenityController.getAmenityCount)

module.exports = routes