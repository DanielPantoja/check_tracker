const mongoose = require('mongoose');
const CheckSchema = require('./check');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job must have a title"],
        minlength: [1]
    },
    payrate: {
        type: Number,
        required: [true, "Job must have a Pay Rate"]
    },
    taxrate: {
        type: Number,
        required: [true, "Job must have a Tax Rate"]
    },
    checks: [CheckSchema]
    
});
mongoose.model("Job", JobSchema);
module.exports = JobSchema;