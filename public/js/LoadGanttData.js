const mongoose = require('mongoose')

const projectM = require('../../models/UserModel')
const functionalityM = require('../../models/FunctionalityModel')

const GetProjectByID = (projectID)=>{
    projectM.findById({_id:projectID}).exec((err,results)=>{
        if(err){
            console.log(err)
        }else{
            console.log(results.functionality_id)
            results.functionality_id.forEach(element => {
                console.log(element)
            });
        }
    })
}

const GetFunctionality = (funcID)=>{
    functionalityM.find({_id:funcID}).exec((err,results)=>{
        if (err) {
            console.log(err)
        } else {
            console.log(results)
        }
    })
}

module.exports={GetProjectByID}