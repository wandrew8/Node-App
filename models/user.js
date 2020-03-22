const mongoose = require('mongoose');
const photoSchema = require('./photo');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    userPhotos: [String],
    favorites: [String]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;