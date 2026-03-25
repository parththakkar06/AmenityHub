const express = require('express')
const routes = express.Router()
const fileController = require('../controllers/FileController')

routes.get("/files",fileController.getAllFiles)

module.exports = routes