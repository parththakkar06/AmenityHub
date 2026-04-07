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
        const { name, email, phone, block, flat } = req.body
        console.log(req.body)
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
        const newUser = await userModel.create(
            {
                name: name,
                email: email,
                phone: phone,
                password : req.body.password,
                address: { blockNo: block, flatNo: flat },
                roleId: selectedRole._id,
                passwordChangedAt: todayDate
            })

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

    if (isValid.valid == true) {
        const user = await userModel.findOne({ email: email }).populate('roleId')
        const token = jwt.sign(
            {
                id: user._id,
                role: user.roleId.name
            },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        )

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax",
            secure: false
        })
        const date = new Date(user.passwordChangedAt)
        date.setDate(date.getDate() + 60)
        const today = new Date()
        console.log(date)
        change = false  
        if(today > date){
            change = true
        }

    
        res.status(200).json({
            message: "OTP Verified. Logging IN.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.roleId.role,
                bool: change
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
    const userFoundFromEmail = await userModel.findOne({ email: email }).populate('roleId', 'role')


    if (userFoundFromEmail) {
        if (bcrypt.compareSync(password, userFoundFromEmail.password)) {
            sendOTP(email)
            res.status(201).json({
                email: email,
                role: userFoundFromEmail.roleId.role,
                id: userFoundFromEmail._id
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


const logout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "Logged Out Successfully!"
    })
}

const changepassword = async (req, res) => {
    try {
        console.log("here")
        const id = req.params.id
        const user = await userModel.findById(id)
        const today = new Date()
        const { oldPass, newPass, confirmNewPass } = req.body

        if (!user) {
            res.status(400).json({
                message: "No User Found"
            })
        }
        if (bcrypt.compareSync(oldPass, user.password)) {
            if (newPass !== confirmNewPass) {
                res.status(400).json({
                    message: "Confirm Pass and New Pass doesn't match"
                })
            } else {
                hashedPassword = await bcrypt.hash(newPass, 10)
                const data = { password: hashedPassword , passwordChangedAt : today}
                const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true })
                res.status(200).json({
                    message: "Password Changed",
                    data: updatedUser
                })
            }
        } else {
            res.status(400).json({
                message: "Incorrect Password!"
            })
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({
            message: "Something went wrong!",
            error: error.message
        })
    }
}

module.exports = {
    register,
    getAllUsers,
    getUserById,
    login,
    verify,
    logout,
    changepassword
}