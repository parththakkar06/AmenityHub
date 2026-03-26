const jwt = require("jsonwebtoken")
const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization

        if (!header || !header.startsWith('Bearer ')) {
            res.status(401).json({
                message: "No Token Found"
            })
        }

        const token = header.split(' ')[1]

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()

    } catch (error) {
        res.status(401).json({
            message: "Invalid Token"
        })
    }
}

module.exports = authMiddleware