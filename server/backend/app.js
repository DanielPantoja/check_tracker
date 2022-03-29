const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const mongoose = require('mongoose');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./routes')(app);

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
console.log('testing these changes')
module.exports = app;




// The Only Solution i have been able to find that works 
// app.use('/', express.static( path.join(__dirname, '../../public/dist/public') ));
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, '../../public/dist/public/index.html'));
// });


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', "*"); 
//     res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS");
//     next();
//     })


//Currrently working on user model and then working on setting up 
//database so users can login and sign up then get redirected to 
//actual home page and you need need authorization middleware

//"mongodb": "^3.6.3", previous 3.6.4
//"mongoose": "^5.11.15" previous 5.11.16

//require('../controllers/checks'); //(node:68826) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
//(Use `node --trace-deprecation ...` to show where the warning was created)