const mongoose = require("mongoose");
const usermodel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    emailToken: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    // token: {
    //     type: String
    // }
})


module.exports = mongoose.model("Userdata", usermodel)