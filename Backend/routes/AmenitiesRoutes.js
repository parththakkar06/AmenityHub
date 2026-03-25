const express = require('express')
const routes = express.Router()
const amenityController = require('../controllers/AmenityController')

routes.get("/amenities",amenityController.getAllAmenities)
routes.post("/amenities",amenityController.addAmenity)
routes.delete("/amenities/:id",amenityController.deleteAmenityById)
routes.put("/amenities/:id",amenityController.updateAmenityById)

module.exports = routes