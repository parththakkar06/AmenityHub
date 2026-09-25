const transactionModel = require('../models/TransactionsModel')

const getAllTransactions = async(req,res) => {
    try {
        const transactions = await transactionModel.find()
            .populate('userId', 'name email')
            .populate('bookingId')
            .sort({ _id: -1 })

        res.status(200).json({
            message : "Transactions fetched successfully",
            data : transactions
        })
    } catch (error) {
        res.status(500).json({
            message : "Error while fetching transactions!",
            error : error.message
        })
    }
}

const createTransaction = async(req, res) => {
    try {
        const { userId, bookingId, amount, paymentMethod, transactionStatus } = req.body
        const transaction = await transactionModel.create({
            userId,
            bookingId,
            amount,
            paymentMethod: paymentMethod || 'UPI',
            transactionStatus: transactionStatus || 'Success'
        })
        res.status(201).json({
            message: "Transaction created successfully",
            data: transaction
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while creating transaction",
            error: error.message
        })
    }
}

module.exports = {
    getAllTransactions,
    createTransaction
}