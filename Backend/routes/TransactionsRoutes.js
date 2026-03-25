const express = require('express')
const routes = express.Router()
const transactionController = require("../controllers/TransactionsController")

routes.get("/transactions",transactionController.getAllTransactions)

module.exports = routes