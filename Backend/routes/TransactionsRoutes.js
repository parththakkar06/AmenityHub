const express = require('express')
const routes = express.Router()
const transactionController = require("../controllers/TransactionsController")

routes.get("/transactions", transactionController.getAllTransactions)
routes.post("/transactions", transactionController.createTransaction)

module.exports = routes