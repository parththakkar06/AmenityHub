const userModel = require('../models/UserModel')
const roleModel = require('../models/RoleModel')
const bcrypt = require('bcrypt')
const twilio = require("twilio")
const client = twilio(process.env.AC_SID, process.env.AUTH_TOKEN);
const jwt = require('jsonwebtoken')


const sendOTP = async (email) => {
    return await client.verify.v2
        .services(process.env.SERVICE_ID)
        .verifications.create({
            to: email,
            channel: 'email'
        })
}

const verifyOTP = async (email, otp) => {
    return await client.verify.v2
        .services(process.env.SERVICE_ID)
        .verificationChecks.create({
            to: email,
            code: otp
        })
}

const register = async (req, res) => {
    try {
        console.log("here")
        const email = req.body.email

        const user = await userModel.findOne({ email: email })
        if (user) {
            res.status(400).json({
                message: "Email already exists!"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword
        const selectedRole = await roleModel.findOne({ role: req.body.role })
        const todayDate = new Date()
        const newUser = await userModel.create({ ...req.body, roleId: selectedRole._id, passwordChangedAt: todayDate })

        res.status(201).json({
            message: 'User Registered! Verify the Email.',
            data: newUser
        })
    } catch (error) {
        res.json({
            message: "Error while creating user",
            error: error.message
        })
    }
}

const verify = async (req, res) => {
    const { email, otp } = req.body

    const isValid = await verifyOTP(email, otp)

    if (isValid) {
        const user = await userModel.findOne({ email: email }).populate('roleId')
        const token = jwt.sign(
            {
                id: user._id,
                role: user.roleId.name
            },
            process.env.SECRET_KEY,
            {expiresIn : '1d'}
        )
        res.status(200).json({
            message: "OTP Verified. Logging IN.",
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role :  user.roleId.role
            }
        })
    } else {
        res.status(400).json({
            message: "Invalid OTP"
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    const userFoundFromEmail = await userModel.findOne({ email: email }).populate('roleId','role')


    if (userFoundFromEmail) {
        if (bcrypt.compareSync(password, userFoundFromEmail.password)) {
            sendOTP(email)
            res.status(201).json({
                email : email,
                role : userFoundFromEmail.roleId.role,
                id : userFoundFromEmail._id
            })
        } else {
            res.status(401).json({
                message: "Invalid Credentials"
            })
        }
    } else {
        res.status(404).json({
            message: "User Not Found!"
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const foundUser = await userModel.findById(req.params.id)
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
        const users = await userModel.find().populate('roleId', 'role')
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
    login,
    verify
}