const roleModel = require('../models/RoleModel')

const createRole = async(req,res) => {
    try {
        const savedRole = await roleModel.create(req.body)
        res.status(201).json({
            message : 'Role Created Successfully',
            roleCreated : savedRole
        })
    } catch (error) {
        res.json({
            message : 'Error While Creating Role',
            error : error.message
        })
    }
}

const getAllRoles = async(req,res) => {
    try {
        const roles = await roleModel.find()
        res.status(201).json({
            message : 'Roles Fetched Successfully',
            roles : roles
        })
    } catch (error) {
        res.json({
            message : 'Error While Fetching Roles',
            error : error.message
        })
    }
}


module.exports = {
    getAllRoles,
    createRole
}