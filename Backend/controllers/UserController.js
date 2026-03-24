const userModel = require('../models/UserModel')
const roleModel = require('../models/RoleModel')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        req.body.password = hashedPassword
        const selectedRole = await roleModel.findOne({ role: req.body.role })
        const todayDate = new Date()
        const expDate = new Date()
        expDate.setDate(expDate.getDate() + 60)
        const newUser = await userModel.create({ ...req.body, roleId: selectedRole._id, passUpdation: { updatedDate: todayDate, expiryDate: expDate } })

        res.status(201).json({
            message: 'User created successfully',
            data: newUser
        })
    } catch (error) {
        res.json({
            message: "Error while creating user",
            error: error.message
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    const userFoundFromEmail = await userModel.find({email : email})
    if(userFoundFromEmail){
        if(bcrypt.compareSync(password,userFoundFromEmail.password)){
            res.status(201).json({
                message : "Log In Successfull"
            })
        }else{
            res.status(401).json({
                message : "Invalid Credentials"
            })
        }
    }else{
        res.status(404).json({
            message : "User Not Found!"
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const foundUser = await userModel.findById(req.body.id)
        if (foundUser) {
            res.status(201).json({
                message: "User Found!",
                data: foundUser
            })
        } else {
            res.status(404).json({
                message: "User not found!",
                data: null
            })
        }
    } catch (error) {
        res.json({
            message: "Error while finding user!",
            error: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(201).json({
            message: "Users Fetched Successfully !",
            data: users
        })
    } catch (error) {
        res.json({
            message: 'Error while fetching users',
            error: error.message
        })
    }
}



module.exports = {
    register,
    getAllUsers,
    getUserById,
    login
}