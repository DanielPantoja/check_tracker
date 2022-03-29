const mongoose = require('mongoose');
const EntrySchema = new mongoose.Schema({
    hours: {
        type: Number,
        required: [true]
    },
    minutes: {
        type: Number,
        required: [true],
        max: [59, "Minutes must be less than 60"]
    },
    date: {
        type: Date,
        required: [true] 
    },
    jobId: {
        type: String,
        required: [false]
    },
    checkId: {
        type: String,
        required: [false]
    }
});
mongoose.model("Entry", EntrySchema); 
module.exports = EntrySchema


//im thinking i use the jobId because i could find entrys 
//question is how to get check data with just job id