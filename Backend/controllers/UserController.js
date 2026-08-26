const userModel = require('../models/UserModel')
const roleModel = require('../models/RoleModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendOtpMail } = require('../utils/MailUtil')

// In-memory store for OTPs: email -> { otp: string, expiresAt: number }
const otpStore = new Map()

const sendOTP = async (email) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes expiration

    otpStore.set(email, { otp: generatedOtp, expiresAt })
    console.log(`Generated OTP for ${email}: ${generatedOtp}`)

    await sendOtpMail(email, generatedOtp)
    return { success: true }
}

const verifyOTP = async (email, otp) => {
    const record = otpStore.get(email)
    if (!record) {
        return { valid: false }
    }

    if (record.otp === otp && Date.now() <= record.expiresAt) {
        otpStore.delete(email) // Single-use OTP cleanup
        return { valid: true }
    }

    return { valid: false }
}

const register = async (req, res) => {
    try {
        const { name, email, phone, block, flat, role, password } = req.body
        const user = await userModel.findOne({ email: email })
        if (user) {
            return res.status(400).json({
                message: "Email already exists!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const roleName = role || 'USER'
        let selectedRole = await roleModel.findOne({ role: roleName })
        if (!selectedRole) {
            selectedRole = await roleModel.create({ role: roleName })
        }

        const todayDate = new Date()
        const newUser = await userModel.create({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            address: { blockNo: block, flatNo: flat },
            roleId: selectedRole._id,
            passwordChangedAt: todayDate
        })

        return res.status(201).json({
            message: 'User Registered Successfully! Please Login.',
            data: newUser
        })
    } catch (error) {
        return res.status(500).json({
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