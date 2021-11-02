require('dotenv').config
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const url = "mongodb+srv://utsav:Utsav%405289@cluster0.x4v0q.mongodb.net/Email";
mongoose.connect(url, { useNewUrlParser: true }, () => {
    console.log('Mongodb Connected');
})
const routes = require("./Routes/user")
app.use(express.json());

app.use('/', routes)
app.listen(port, console.log(`server start ${port}`))