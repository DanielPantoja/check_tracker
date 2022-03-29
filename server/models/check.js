const mongoose = require('mongoose');
const EntrySchema = require('./entry');

const CheckSchema = new mongoose.Schema({
    start: {
        type: Date,
        required: [true],
    },
    end: {
        type: Date,
        required: [true]
    },
    jobId: {
        type: String,
        required: [false]
    },
    entrys: [EntrySchema]
});
mongoose.model("Check", CheckSchema);
module.exports = CheckSchema