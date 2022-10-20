const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const mongoose = require('mongoose');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./routes')(app);
require('dotenv').config()
mongoose.connect('mongodb+srv://Daniel:uvvmUirkdResPiEM@cluster0.yto1b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' ,{ useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to database sir")
})
.catch((err) => { 
    console.log(err)
    console.log("Connection to database failed")
});

app.use('/', express.static( path.join(__dirname, '../../public/dist/public') ));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../../public/dist/public/index.html'));
});
module.exports = app;