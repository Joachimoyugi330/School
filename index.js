// const Joi = require('joi');
const express = require('express');
const students_routes = require('./routes/students');
const courses_routes = require('./routes/courses');
const home_routes = require('./routes/home');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // change if views are not in views folder

app.use(express.json());
app.use(express.static('public')); //use localhost/MyResume.pdf to view static pdf --> static files are served from the root of the project
app.use(express.urlencoded({extended:true}))
app.use('/api/students', students_routes);
app.use('/api/courses', courses_routes);
app.use('/', home_routes);







const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on Port ${port}...`))



