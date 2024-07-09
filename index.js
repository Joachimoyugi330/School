const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const courses =[
    {id: 1, name: 'Math'},
    {id: 2, name: 'Science'},
    {id: 3, name: 'English'}
]

app.get('/', (req, res)=>{
    res.send('Hello World');
});

app.get('/api/courses', (req, res)=>{
    res.send(courses)
})

// Route Parameters
app.get('/api/courses/:id', (req, res)=>{
    const course = courses.find(c => c.id===parseInt(req.params.id))
    if(!course) return res.status(404).send('Course Not Found')
    res.send(course);
})

// MUltiple route parameters
// req.query to read query parameter
app.get('/api/courses/:id/:year', (req, res)=>{
    res.send(req.params)
})

// POST Requests

app.post('/api/courses', (req, res)=>{
    const { error } = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message)
        // 400 bad request
        
    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

// Update
app.put('/api/courses/:id', (req, res)=>{
    // lookup the course
    // If not existing, return 404

    // validate
    // if invalid, return 400 - Bad request

    // update course
    // return the updated course

    // lookup
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) return res.status(404).send('Course does not exist')
    
    // Validate
    const { error } = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message)
     // error 400 bad request    

    // update
    course.name=req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course does not exist')
    
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course)
})

// Validate Function
function validateCourse(course){
    const schema = {
        name: Joi.string().min(5).required()
        
    }
    return Joi.validate(course, schema)
}

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on Port ${port}...`))



