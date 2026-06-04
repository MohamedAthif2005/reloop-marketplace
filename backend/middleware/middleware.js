const jwt = require("jsonwebtoken")
const User = require("../models/User")

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization")
        if (!authHeader) {
            throw new Error()
        }

        const token = authHeader.replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded._id)

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate." })
    }
}

module.exports = verifyToken