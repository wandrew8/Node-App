const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
    },
    tags: [String],
    imageUrl: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;