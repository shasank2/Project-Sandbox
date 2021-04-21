const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Feedback', FeedbackSchema)