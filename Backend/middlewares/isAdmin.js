const isAdmin = (req,res,next) => {
    if(req.user.role !== "ADMIN"){
        res.status(403).json({
            message : "Access Denied"
        })
    }else{
        next()
    }
}

module.exports = isAdmin