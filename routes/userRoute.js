const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs')

const { body,validationResult, Result } = require('express-validator');

//imports form GetUserProject
const {getProjects} = require('../public/js/GetUserProject')
const projObjectList = require('../public/js/GetUserProject')

//imports form LoadGanttData
//const {GetProjectByID} = require('../public/js/LoadGanttData')

//Project variable
var ProjectID ;
var projectName 
var startdate;
var enddate;
//var UserID = '';
var remain;

project_funcID = [];
var project_title, project_description, project_start_date, project_end_date, project_remain_time;

//For the project user selected to work with
var userSelectedProject 
//Objects of Functionalities for Kanban and Gantt chart
var FuncObjects = [];



//importing models
const userM = require('./../models/UserModel');
const projectM = require('./../models/ProjectModel');
const functionalityM = require('./../models/FunctionalityModel');
//const methodologiesM = require('./../models/MethodologyModel');
const sprintsM = require('./../models/SprintsModel')
const feedbackM = require('./../models/FeedbackModel');

//Sleep function
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

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

//Date formatter dd-mm-yyyy
const DateFormat= (InputDate) =>{
    var today;
    var dd = String(InputDate.getDate()).padStart(2, '0');
    var mm = String(InputDate.getMonth() + 1).padStart(2, '0');
    var yyyy = InputDate.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today.replace(/[/]/g,"-");
}

//Have to add 1 day plus for end date format
const EndDateFormat= (InputDate) =>{
    var today;
    var dd = String(InputDate.getDate() +5 ).padStart(2, '0');
    var mm = String(InputDate.getMonth() + 1).padStart(2, '0');
    var yyyy = InputDate.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today.replace(/[/]/g,"-");
}

//Load Gantt Data
// const GetProjectByID = (projectID)=>{
//     projectM.findById({_id:projectID}).exec((err,results)=>{
//         if(err){
//             console.log(err)
//         }else{
//             startdate = DateFormat(results.start_date);
//             enddate = EndDateFormat(results.end_date);
//             remain = RemTime(results.start_date,results.end_date)
//             console.log(results.functionality_id)
//             results.functionality_id.forEach(element => {
//                 //console.log(element)
//                 GetFunctionality(element)
//             });
//         }
//     })
// }

const GetProjectByID = async (projectID) => {
    projectM.findById({ _id: projectID }).exec((err, result) => {
        project_title = result.title
        project_description = result.description
        project_start_date = result.start_date
        project_end_date = result.end_date
        project_remain_time = RemTime(project_start_date,project_end_date)
        result.functionality_id.forEach(element => {
            GetFunctionality(element)
        })
    })
}
        

const GetFunctionality = async (funcID)=>{
    FuncObjects = []
    functionalityM.findOne({_id:funcID}).exec((err,results)=>{
        if (err) {
            console.log(err)
        } else {            
            FuncObjects.push(results)
        }
    })
    await sleep(2000)
}

//Get remaining time
const RemTime = (startdate,enddate)=>{
    var remain
    var one_day=1000*60*60*24
    remain = Math.abs(enddate-startdate)
    remain = Math.round(remain/one_day)
    return remain + 1      // have to add 1 day for remaining days because of date reasons
}

//importing passport.js
const passport = require('passport');
const { Promise } = require('mongoose');
const { text } = require('body-parser');
// const { deleteOne } = require('./../models/UserModel');
// const { session } = require('passport');

//Get requests
router.get('/',(req,res)=>{
    res.render('Welcome',{
        errors:'',
        adminError:''
    })
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

router.get('/Sprints', async (req,res)=>{
    data=[]
    await project_funcID.forEach((element) => {
        GetFunctionality(element)
    });
    await sleep(500)
    console.log(FuncObjects)
    FuncObjects.forEach(element=>{
        var obj = {
            id: element._id,
            title: element.Functionality,
            description:element.Description,
            sprint_phase:element.SprintPhase,
            status:element.status
        }
        data.push(obj)
    })
    res.render('Sprints',{
        'remainingtime': project_remain_time,
        'project_start_date': project_start_date,
        'project_end_date': project_end_date,
        'LoadedFunctionalities': data
    })
})

router.get('/Teams',(req,res)=>{

    res.render('Teams')
})

router.get('/GanttChart',(req,res)=>{
    data=[{
        id : 1,
        text : project_title,
        start_date: project_start_date,
        duration: project_remain_time,
        end_date: project_end_date,
    }]
    FuncObjects.forEach(element=>{
        var obj = {
            id: element._id,
            text: element.Functionality,
            start_date: startdate,
            duration: 1,
            parent: 1
        }
        data.push(obj);
    })
    console.log(data)
    res.render('GanttChart',{ 
        'LoadedFunctionalities':data
    })
})

// router.post("/GanttChart/", function (req, res) { 
//     var tasks = req.body;  
//     console.log(tasks)
//   });
   
//   // update a task
//   router.put("/api/", function (req, res) {
//     var sid = req.params.id,
//       tasks = getTask(req.body);
//       console.log(tasks)
//   });
   
//   // delete a task
//   router.delete("/api/", function (req, res) {
//     var sid = req.params.id;
//   });
   

router.get('/Kanban',async (req,res)=>{
    UndefFuncObjects = []
    FuncObjects = []
    SprintObject = []

    projectM.findById({_id:userSelectedProject})
    .populate('sprints')
    .exec(async(err,results)=>{  
        console.log(results)      
        results.sprints.forEach(async(element)=>{
            var obj_a = {
                id: element._id,
                title: element.title,
                sprintID: element.sprintID,
                start_date: element.start_date,
                end_date: element.end_date,
                remainingtime: RemTime(element.start_date, element.end_date),
                status: element.status,
                tasks : []
            }
            console.log(obj_a)
            element.tasks.forEach((el)=>{
                functionalityM.findById({_id:el}).exec((err,func)=>{
                    UndefFuncObjects.push(func)
                    var obj_b = {
                        id: func._id,
                        title: func.Functionality,
                        SprintPhase: func.SprintPhase,
                        status: func.status,
                    }
                    obj_a.tasks.push(obj_b)
                })
            
            })
            await sleep(500)
            SprintObject.push(obj_a)
        })
        await sleep(500)
        console.log(SprintObject)
    })
    await sleep(1000)
    res.render('Kanban',{ 
        'LoadedFunctionalities':SprintObject 
    })
})

router.post('/Sprints',(req,res)=>{
    console.log("post request sprint");
    sprint_id_list = []
    functionality_data = JSON.parse(req.body.Functionalities)
    sprint_data = JSON.parse(req.body.board_list);

    //Saving each Sprint
    sprint_data.forEach(async(element) => {
        sprint = new sprintsM({
            sprintID: element.sprintID,
            title: element.title,
            start_date: element.start_date,
            end_date: element.end_date
        })
        element.tasks.forEach((el)=>{
            sprint.tasks = el
        })
        sprint_id_list.push(sprint._id)
        sprint.save()
        await sleep(500)
    });
    //Updating SprintPhase in functionality
    functionality_data.forEach((el) => {
        functionality = functionalityM.findOneAndUpdate({ _id: el._id },
            { $set: { SprintPhase: el.SprintPhase } }, { useFindAndModify: false })
            .exec((err, result) => {
                console.log("Sprint are updated in functionality")
                console.log(result)
            })
    })
 
    //Updating Project Sprints
    project = projectM.findOne({_id:ProjectID}).exec((err,results)=>{
        sprint_id_list.forEach(element=>{
            results.sprints.push(element)
        })
        results.save()
    })
    res.redirect('/Kanban')
})

router.post('/Kanban',(req,res)=>{
    console.log("Post request for Kanban")
    list_update = JSON.parse(req.body.list_update)
    list_update.forEach((el)=>{
        functionality = functionalityM.findOneAndUpdate({_id:el.id},
        { $set: { status: el.status, start_date:el.start_date, end_date:el.end_date} }, { useFindAndModify: false })
        .exec((err,result)=>{
            console.log(result)
        })
    })
})

router.post('/Projects',(req,res)=>{
    userSelectedProject = req.body.h4ID
    projectName = req.body.h4Name
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
            res.render('Welcome',{ errors:errors,adminError:'' })
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

    //variables for this create process
    project_id = req.body._id
    project_title = req.body.title
    project_description = req.body.description
    project_start_date = new Date(req.body.startdate)
    project_end_date = new Date(req.body.enddate) 
    project_remain_time = RemTime(project_start_date,project_end_date);
    project_funcID = [];

    //first the functionality is saved to its model//
    func = req.body.functionality
    const funcArray = func.split(',')
    funcArray.forEach(element => {
        let functionalities = new functionalityM({
            Functionality:element,
        }) 

        //adding list of functionality id in an empty list
        project_funcID.push(functionalities._id)

        functionalities.save((err)=>{
            if(err){console.log(err)}
            else{
                console.log(`functionality ${functionalities._id} added to database`)
            }
        })
    });
    
    //finally working on project created
    //let datetime = new Date();
    let project = new projectM({
        title : project_title,
        description :  project_description,
        start_date :  project_start_date,
        end_date :  project_end_date,
        functionality_id : project_funcID
    })

    //Saving project_id to be used for next route/for query
    ProjectID = project._id
    userSelectedProject = project._id
    project.save( async (err)=>{
        if(err){console.log(err)}
        else{
            console.log('Project created')
            //Add Project to user function here//// not used any more
            userProjectsUpdate(UserID,ProjectID)
            GetProjectByID(ProjectID)
        }
    })
    res.redirect('/Sprints')

})

//Methodology updating function
// const updateMethodology = async(ProjectID,meth_id)=>{
//     try {
//         const projectobj = await projectM.findByIdAndUpdate({_id: ProjectID},{
//             $set:{
//                 methodology_id : meth_id
//             }
//         },{
//             new: true,
//             useFindAndModify: false 
//         });
//         console.log(projectobj)
//     } catch (error) {
//         console.log(error)
//     }
// }

//route after selecting methodology
// router.post('/Methodologies',(req,res)=>{
//     methodologiesM.findOne({name:req.body.selectedTab}).exec((err,docs)=>{
//         if (err){
//             console.log(err)
//         }else{
//             updateMethodology(ProjectID,docs._id) //Use project ID and selected Tab ID
//             console.log("Methodology Updated")
//             res.redirect('/Projects')
//         }
//     })
//     //if condition for directing user to chosen methodology 
// })

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

//Routes for admin panel
router.get('/Adminlogin',(req,res)=>{
    res.render('Adminlogin',{
        errors:'',
        adminError:''
    })
})

router.get('/Adminuser',(req,res)=>{
    res.render('Adminuser')
})

router.get('/Adminfeedbacks',(req,res)=>{
    const getFeedbacks = async ()=>{
        await feedbackM.find()
        .then((value)=>{
            console.log(value)
            res.render('Adminfeedbacks',{
                'feedbacks' : value
            })
        })  
    }
    getFeedbacks()
})

router.get('/Adminprojects',(req,res)=>{
    res.render('Adminprojects')
})

router.post('/Adminlogin',(req,res)=>{
    if (req.body.username != "admin") {
        adminError = "Wrong password"
        console.log("Wrong admin Username")
        res.redirect('/Adminlogin')
    }else if (req.body.password != "admin") {
        adminError = "Wrong username"
        console.log("Wrong admin password")
        res.redirect('/Adminlogin')
    } else {
        res.redirect('Adminuser')
    }
})
module.exports = router;