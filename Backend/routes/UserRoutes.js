const express = require('express')
const routes = express.Router()
const userController = require('../controllers/UserController')
const authMiddleware = require("../middlewares/authMiddleware")

routes.post("/register",userController.register)
routes.get("/users",authMiddleware,userController.getAllUsers)
routes.post("/login",userController.login)
routes.get("/users/:id",authMiddleware,userController.getUserById)
routes.post("/verify-otp",userController.verify)
routes.post("/logout",userController.logout)


module.exports = routes