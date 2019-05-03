var mongoose = require('mongoose');

let Schema = mongoose.Schema;

var Employee = new Schema({
    fullname: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    profilePicture: String,
    created_at: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: false
});

module.exports = mongoose.model('Employee',Employee);