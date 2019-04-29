var mongoose = require('mongoose');


let Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'username is required']
    },
    password: {
        type: String,
        required: [ true, 'password is required']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model('User', User);