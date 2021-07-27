const mongoose = require('mongoose')
const Functionality = require('./FunctionalityModel').schema;

const SprintsSchema = new mongoose.Schema({
    sprintID:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required: true
    },
    tasks: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Functionality'
    }],
    start_date:{
        type: Date
    },
    end_date:{
        type: Date
    },
    status:{
        type: String,
        enum: ['Complete','Incomplete'],
        default: 'Incomplete'
    }
})
module.exports = mongoose.model('Sprints', SprintsSchema);