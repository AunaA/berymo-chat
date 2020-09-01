const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true,
        max:64
    },
    lastname: {
        type: String,
        require: true,
        max:64
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        lowercase: true,
    },
    position: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    resetLink: {
        data: String,
        default:''
    }
},{timestamps: true});

const User = mongoose.model('User', UserSchema);

module.exports = User;