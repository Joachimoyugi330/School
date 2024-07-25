require('express-async-errors');
const winston = require('winston');
require('winston-mongodb')
const cors = require('cors');
require('dotenv').config();
// const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const students_routes = require('./routes/students');
const courses_routes = require('./routes/courses');
const results_routes = require('./routes/results');
const home_routes = require('./routes/home');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // change if views are not in views folder

app.use(cors());
app.use(express.json());
app.use(express.static('public')); //use localhost/MyResume.pdf to view static pdf --> static files are served from the root of the project
app.use(express.urlencoded({extended:true}))
app.use('/api/students', students_routes);
app.use('/api/courses', courses_routes);
app.use('/api/results', results_routes);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home_routes);
app.use(error);

const jwtPrivateKey = process.env.SCHOOL_JWT_PRIVATE_KEY;

// if (!jwtPrivateKey) {
//     throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
// }

if(!jwtPrivateKey){
    console.log("FATAL ERROR: jwtPrivateKey is not defined.") 
    process.exit(1);
}

// if(!config.get('jwtPrivateKey')){
//     console.error('FATAL ERROR: jwtPrivateKey is not defined.')
//     process.exit(1);
// }

winston.add(winston.transports.File, {filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, {db: 'mongodb://127.0.0.1/School1'})

// Handling uncaught exception --> Method 1
process.on('uncaughtException', (ex)=>{
    // console.log("We got an uncaught exception");
    winston.error(ex.message, ex);
    process.exit(1);
})

// Handling uncaught exception --> Method 2
// winston.handleExceptions(
//     new winston.transports.File({filename: 'uncaughtExceptions.log'})
// )
// Handling unhandled promise rejection
process.on('unhandledRejection', (ex)=>{
    // console.log("We got an unhandled rejection");
    winston.error(ex.message, ex);
    process.exit(1);
})


// throw new Error ("Some went wrong")

//Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1/School1')
.then(()=> {
    console.log('Connected to MongoDB')})
    
.catch(err=> console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`Listening on Port ${port}...`))
