const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
}, {
    timestamps: true
});


const photoSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    author: [{type: Schema.Types.ObjectId, ref: 'User'}],
    tags: [String],
    imageUrl: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;