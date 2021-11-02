const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require('dotenv').config
const User = require('../Models/userModel')
const bcrypt = require("bcrypt");
const config = require('../Authentication/config');
const jwt = require("jsonwebtoken");
const { verify } = require("../Authentication/auth")
const nodemailer = require("nodemailer");
const crypto = require('crypto');
var path = require('path');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.username,
        pass: config.password
    }, tls: {
        rejectUnauthorized: false
    }
});

router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.send("Please enter name,email and password")
    }
    if (password.length < 6) {
        res.send("password must be 6 character")
    } else {
        User.findOne({ email })
            .then(user => {
                if (user) {
                    return res.status(400).json({ message: "Email alredy taken" })
                } else {
                    const newuser = new User({
                        name,
                        email,
                        password,
                        emailToken: crypto.randomBytes(64).toString('hex'),
                    })
                    const token = jwt.sign(
                        { _id: newuser._id },
                        config.secretKey,
                        {
                            expiresIn: "48h",
                        }
                    );
                    newuser.token = token;

                    bcrypt.genSalt(10, (err, uv) => {
                        bcrypt.hash(newuser.password, uv, (err, hash) => {
                            if (err) throw err;
                            newuser.password = hash;
                            newuser.save()

                            var mailOptions = {
                                from: '"verify user" <utsavvasoya89@gmail.com>',
                                to: newuser.email,
                                subject: 'Account Verification Link',
                                html: `<h2>${newuser.name} ! Thanks for registering on our site</h2>
                                       <h4>Please verify your mail to continue..</h4>
                                       <a href="http://${req.headers.host}/verify?token=${newuser.emailToken}"> Verify Your mail</a>`
                            }
                            transporter.sendMail(mailOptions, (err, info) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).send({ msg: 'Technical Issue!' });
                                } else {
                                    res.status(200).json({ message: "Registration seccessful, verification email has been sent to " + newuser.email, newuser });
                                }
                                // .then(result => {
                                // res.status(200).json({ message: "Registration seccessful", result })
                            })
                            // .catch(err => res.status(400).json({ message: "invalid email", err }));
                        })
                    })

                }
            })
    }
})
router.post('/login', verify, (req, res) => {
    const { email, password } = req.body
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(401).send('user not found!  Please register');
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(400).send('server error');
                    }
                    else if (result) {
                        return res.status(200).json({ result, user, message: 'login successfully' });
                    }
                    else {
                        return res.send('login info incorrect');
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})


router.get('/verify', async (req, res) => {

    const user = await User.findOne({ emailToken: req.query.token })

    if (user) {
        user.emailToken = null
        user.isVerified = true
        await user.save()
        return res.sendFile(path.join(__dirname, "./temp.html"))
    } else {
        console.log('not verify');

    }
})

module.exports = router