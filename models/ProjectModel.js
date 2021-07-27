const mongoose = require('mongoose')
const Sprints = require('./SprintsModel').schema;

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
    
    sprints:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sprints'
    }],
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
    // methodology_id:{   //foreign key
    //     type: String,
    //     default: 'none',
    //     required: true
    // },
})
module.exports = mongoose.model('Project', ProjectSchema);
