var mongoose = require('mongoose');

let Schema = mongoose.Schema;

var Employee = new Schema({
    fullname: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    gender: {
        type: String,
    },
    salary: {
        type: Number,
    },
    designation: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: false
});

module.exports = mongoose.model('Employee',Employee);