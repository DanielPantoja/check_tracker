const mongoose = require('mongoose');
const JobSchema = require('./job');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: {
        type: String,
        required: [true, "Profile must have a first name"],
        minlength: [1]
    },
    last_name: {
        type: String,
        required: [true, "Profile must have a last name"]
    },
    email: {
        type: String,
        required: [true, "Profile must have an email"],
        unique: true,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    password: {
        type: String,
        required: "Must have a password",
        minlength: [8, "Password must be atleast 8 charcters"]
    },
    jobs: [JobSchema]
});
UserSchema.plugin(uniqueValidator);
mongoose.model("User", UserSchema);
module.exports = UserSchema;



