const express = require('express')
const routes = express.Router()
const userController = require('../controllers/UserController')

routes.post("/register",userController.register)
routes.get("/users",userController.getAllUsers)


module.exports = routes