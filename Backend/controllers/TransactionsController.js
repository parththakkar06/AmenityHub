const transactionModel = require('../models/TransactionsModel')

const getAllTransactions = async(req,res) => {
    try {
        const transactions = await transactionModel.find()

        res.status(201).json({
            message : "Transactions fetched successfully",
            data : transactions
        })
    } catch (error) {
        res.json({
            message : "Error while fetching transactions!",
            error : error.message
        })
    }
}

module.exports = {
    getAllTransactions
}