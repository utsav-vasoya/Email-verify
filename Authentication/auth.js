const jwt = require("jsonwebtoken");
const config = require('./config');
const User = require('../Models/userModel')
const login = (req, res, next) => {
    const token = req.headers['access-token'];
    if (token) {
        const validtoken = jwt.verify(token, config.secretKey)
        if (validtoken) {
            res.user = validtoken
            next()
        } else {
            res.send("token expire")
        }
    } else {
        res.send("toen not found or fill the data")
    }

}

const verify = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (user.isVerified == true) {
        next();
    } else {
        res.status(500).json({ message: "please check your email to verify your account" })

    }
}
module.exports = { verify, login }