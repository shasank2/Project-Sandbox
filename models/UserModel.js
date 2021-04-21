const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    create_date:{
        type: Date,
        default: Date.now
    },
    projects:[]  //foregin key
});

module.exports = mongoose.model('User', UserSchema); 