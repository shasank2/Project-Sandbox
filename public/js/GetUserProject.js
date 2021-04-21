const mongoose = require('mongoose')
const userM = require('../../models/UserModel')
const projectM = require('../../models/ProjectModel')

const getProjects = async (UserID)=>{
    //list of project id
    try {
        projObjectList = []
        const user = await userM.findOne({_id:UserID});
        for (let index = 0; index < user.projects.length; index++) {
            const project1 = await projectM.findOne({_id:user.projects[index]});
            projObjectList.push(project1);
        }
        // projObjectList = []
        // //foreach async here
        //  projList.forEach ((element) => {
        //     const proj = await projectM.find({_id:element})
        //     console.log(proj)
        //     projObjectList.push(proj);
        // });
        console.log(projObjectList)
        return projObjectList;
    } catch (error) {
        console.log(error)
    }
} 


module.exports={getProjects}