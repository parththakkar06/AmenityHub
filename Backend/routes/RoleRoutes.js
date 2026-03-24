const express = require('express')
const routes = express.Router()
const roleController = require('../controllers/RoleController')


routes.post('/create-role',roleController.createRole)
routes.get('/roles',roleController.getAllRoles)


module.exports = routes