const mongoose = require('mongoose')

const FunctionalitySchema = new mongoose.Schema({
    Functionality:{
        type:String,
        required:true
    },
    Description:{
        type:String
    },
    SprintPhase:{
        type: String,   //Use sprintID ("data-id" attribute in HTML)
        default: 'Unassigned Tasks'
    },
    start_date:{
        type: Date,
    },
    end_date:{
        type: Date,
    },
    status:{
        type:String,
        enum: ['To Do','Doing','Done'],
        default: 'To Do'
    }
    
})

module.exports = mongoose.model('Functionality',FunctionalitySchema)