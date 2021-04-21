const mongoose = require('mongoose')

const FunctionalitySchema = new mongoose.Schema({
    Functionality:{
        type:String,
        required:true
    },
    Description:{
        type:String
    },
    Status:{
        type:String,
        enum: ['Complete','Incomplete'],
        default: 'Incomplete'
    }
})

module.exports = mongoose.model('Functionality',FunctionalitySchema)