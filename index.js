//express server
const express = require('express');
const app = express();
const flash = require('connect-flash');

//.env file reader
const dotenv = require('dotenv').config();

const path = require("path");
const ejs = require('ejs')
const mongoose = require('mongoose');
const port = process.env.PORT;
const passport = require('passport')
const session = require('express-session')

require('./passport')(passport)

//to get value from inputs of form
app.use(express.urlencoded({ extended:false }))
//app.use(express.json())

//paths
const staticpath = path.join(__dirname,"/public");

//ejs template for reading html files
app.use(express.static(__dirname + '/views'));

app.use(express.static(staticpath));
app.set('view engine', 'ejs')


//Session
app.use(session({
    secret: 'secretkey',
    resave: true,
    saveUninitialized: true
}));

//bring in passport js
app.use(passport.initialize());
app.use(passport.session());

//database connection
mongoose.connect(process.env.MONGO_URI, 
    {useNewUrlParser: true, useUnifiedTopology: true},()=>
    {console.log('connected')
});

// flash message for validation when page redirects
app.use(flash());

//Global varibales
// app.use(function (req, res, next) {
//     const successArr = req.flash('success');
//     const errorArr = req.flash('error');
//     res.locals.success = successArr[0];
//     res.locals.error = errorArr[0];
//     next();
// });

//render and display first page
app.use('/', require('./routes/userRoute'))

//Signup/create an account
app.use('/signup', require('./routes/userRoute'))

//Log into account
app.use('/login', require('./routes/userRoute'))

//Projects page
app.use('/Projects', require('./routes/userRoute'))

//Create page
app.use('/Create', require('./routes/userRoute'))

//Sprints page
app.use('/Sprints', require('./routes/userRoute'))

//Teams page
app.use('/Teams', require('./routes/userRoute'))

//Methodologies page
app.use('/Methodologies', require('./routes/userRoute'))

//Contacts page
app.use('/Contacts', require('./routes/userRoute'))

//About page
app.use('/About', require('./routes/userRoute'))

//Gantt Chart page
app.use('/GanttChart', require('./routes/userRoute'))

//Kanban Board page
app.use('/Kanban', require('./routes/userRoute'))


//Admin panel
app.use('/Adminlogin',require('./routes/userRoute'))

app.use('/Adminuser',require('./routes/userRoute'))

app.use('/Adminfeedbacks',require('./routes/userRoute'))

app.use('/Adminprojects',require('./routes/userRoute'))
//ports
app.listen(port, ()=>{
    console.log(`listening at port ${port}....`)
});