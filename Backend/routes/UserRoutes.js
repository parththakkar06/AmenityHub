const express = require('express')
const routes = express.Router()
const userController = require('../controllers/UserController')

routes.post("/register",userController.register)
routes.get("/users",userController.getAllUsers)
routes.post("/login",userController.login)
routes.get("/users/:id",userController.getUserById)
routes.post("/verify-otp",userController.verify)


module.exports = routes