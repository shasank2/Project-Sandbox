const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs')

const { body,validationResult, Result } = require('express-validator');

//imports form GetUserProject
const {getProjects} = require('../public/js/GetUserProject')
const projObjectList = require('../public/js/GetUserProject')

//imports form LoadGanttData
//const {GetProjectByID} = require('../public/js/LoadGanttData')

//Project ID variable
var ProjectID = '';
//var UserID = '';

//For the project user selected to work with
var userSelectedProject 
//Objects of Functionalities for Kanban and Gantt chart
var FuncObjects = [];

//importing models
const userM = require('./../models/UserModel');
const projectM = require('./../models/ProjectModel');
const functionalityM = require('./../models/FunctionalityModel');
const methodologiesM = require('./../models/MethodologyModel');
const feedbackM = require('./../models/FeedbackModel');

//Add project to user model
const userProjectsUpdate = async(UserID,ProjectID)=>{
    try {
        const userObj = await userM.findByIdAndUpdate({_id: UserID},{
            $push:{
                projects : ProjectID
            }
        },{
            new: true,
            useFindAndModify: false 
        });
        console.log(userObj)
    } catch (error) {
        console.log(error)
    }
}

//Load Gantt Data
const GetProjectByID = (projectID)=>{
    projectM.findById({_id:projectID}).exec((err,results)=>{
        if(err){
            console.log(err)
        }else{
            console.log(results.functionality_id)
            results.functionality_id.forEach(element => {
                //console.log(element)
                GetFunctionality(element)
            });
        }
    })
}
const GetFunctionality = (funcID)=>{
    FuncObjects = []
    functionalityM.find({_id:funcID}).exec((err,results)=>{
        if (err) {
            console.log(err)
        } else {
            //console.log(results)
            FuncObjects.push(results)
        }
    })
}

//importing passport.js
const passport = require('passport');
const { Promise } = require('mongoose');
// const { deleteOne } = require('./../models/UserModel');
// const { session } = require('passport');

//Get requests
router.get('/',(req,res)=>{
    res.render('Welcome',{errors:''})
})

router.get('/Create',(req,res)=>{
    res.render('Create')
})

router.get('/Projects',async (req,res)=>{
    let projectList = await getProjects(req.user._id)
    res.render('Projects',{
        'project':projectList
    })
})

router.get('/Methodologies',(req,res)=>{
    res.render('Methodologies')
})

router.get('/Contacts',(req,res)=>{
    res.render('Contacts',{message:req.flash('message')})
})

router.get('/About',(req,res)=>{
    res.render('About')
})

router.get('/GanttChart',(req,res)=>{
    res.render('GanttChart',{ 
        'LoadedFunctionalities':FuncObjects
    })
})

router.get('/Kanban',(req,res)=>{
    console.log(FuncObjects)
    // data=[]
    // FuncObjects.forEach(element=>{
    //     //console.log(element._id)
    //     console.log(element[0].Functionality)
    //     var obj = {
    //         id: element[0]._id,
    //         task: element[0].Functionality
    //     }
    //     data.push(obj)
    // })
    res.render('Kanban',{ 
        'LoadedFunctionalities':FuncObjects
    })
})

router.post('/Projects',(req,res)=>{
    userSelectedProject = req.body.h4ID
    GetProjectByID(userSelectedProject)
    res.redirect('/Kanban')
})

//Post requests
router.post('/signup',
    body('username').trim().isLength({min:8}).withMessage('Username must be at least 8 characters long'),
    body('email').trim().isEmail().normalizeEmail()
    .custom((value,{req, loc, path}) => {
        return userM.findOne({ email:req.body.email }).then(user => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }),
    body('password').isLength({min: 8}).withMessage('Password must be at least 10 characters long'),
    body('conf_password').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true
    }),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('Welcome',{ errors:errors })
            console.log(errors) 

        }
        else{
            let user = new userM({
                username : req.body.username,
                email : req.body.email,
                password : req.body.password,
                conf_password : req.body.conf_password
            })

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(user.password,salt,(err,hash)=>{
                    if (err) throw err;
                    user.password = hash 

                    user.save((err)=>{
                        if(err){console.log(err)}
                        else{ 
                            req.flash('success', 'Registered successfully and ready to Login')
                            res.locals.message = req.flash();
                            console.log('registered')
                            res.redirect('back')
                        }
                    })
                })
            })
        }
    })
    
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: 'Projects',
        failureRedirect: 'back',
        failureFlash: true
    })(req,res,next);
})

router.post('/Create',(req,res)=>{
    UserID = req.user._id
    //empty list to store functionality id
    funcID = [];

    //first the functionality is saved to its model//
    func = req.body.functionality
    const funcArray = func.split(',')
    funcArray.forEach(element => {
        let functionalities = new functionalityM({
            Functionality:element,
        }) 

        //adding list of functionality id in an empty list
        funcID.push(functionalities._id)

        functionalities.save((err)=>{
            if(err){console.log(err)}
            else{
                console.log(`functionality ${functionalities._id} added to database`)
            }
        })
    });
    
    //finally working on project created
    let datetime = new Date();
    let project = new projectM({
        title : req.body.title,
        description : req.body.description,
        start_date : datetime,
        end_date : req.body.enddate,
        functionality_id : funcID
    })

    //Saving project_id to be used for next route/for query
    ProjectID = project._id
    project.save((err)=>{
        if(err){console.log(err)}
        else{
            console.log('added to database')
            //Add Project to user function here////
            userProjectsUpdate(UserID,ProjectID)
            res.redirect('/Methodologies')
        }
    })
})

//Methodology updating function
const updateMethodology = async(ProjectID,meth_id)=>{
    try {
        const projectobj = await projectM.findByIdAndUpdate({_id: ProjectID},{
            $set:{
                methodology_id : meth_id
            }
        },{
            new: true,
            useFindAndModify: false 
        });
        console.log(projectobj)
    } catch (error) {
        console.log(error)
    }
}

//route after selecting methodology
router.post('/Methodologies',(req,res)=>{
    methodologiesM.findOne({name:req.body.selectedTab}).exec((err,docs)=>{
        if (err){
            console.log(err)
        }else{
            updateMethodology(ProjectID,docs._id) //Use project ID and selected Tab ID
            console.log("updated")
            res.redirect('/Kanban')
        }
    })
    //if condition for directing user to chosen methodology 
})

//Post route for sending feedback
router.post('/Contacts',(req,res)=>{
    let feedback = new feedbackM({
        title:req.body.title,
        feedback:req.body.feedback,
        user_id:req.user._id
    })
    feedback.save((err)=>{
        if(err){console.log(err)}
        else{
            req.flash('message','Your feedback has been submitted.')
            res.redirect('/Contacts')
        }
    })
})

//Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});
module.exports = router;