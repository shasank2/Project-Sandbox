const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    functionality_id:[], //list of foregin keys
    
    methodology_id:{   //foreign key
        type: String,
        default: 'none',
        required: true
    },
    start_date:{
        type: Date,
        required:true
    },
    end_date:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['Complete','Incomplete'],
        default: 'Incomplete'
    }
})
module.exports = mongoose.model('Project', ProjectSchema);
