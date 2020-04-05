const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    userImage: {
        type: String,
        default: ''
    },
    favorites: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
    postedPhotos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);