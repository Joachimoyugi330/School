const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))

const courses =[
    {id: 1, name: 'Math'},
    {id: 2, name: 'Science'},
    {id: 3, name: 'English'}
]

// Students section
const students = [{
    adm: 100,
    name: "Joachim",
    email: "joachimoyugi@gmail.com"
},
{
adm: 101,
name: "Mary",
email: "maryg@gmail.com"
}
]

app.get('/api/students', (req, res)=>{
    res.send(students);
});

app.get('/api/student/:adm', (req, res)=>{
    const student = students.find(student => student.adm === parseInt(req.params.adm))

    if(!student) return res.status(404).send("Student with that ID does not exist")
    
    res.send(student);
})

app.post('/api/students', (req, res)=>{
    const { error } = validateStudent(req.body)

    if(error) return res.status(400).send(error.details[0].message)

    const new_adm = (students[students.length-1].adm)+1
    const student = {
        adm: new_adm,
        name: req.body.name,
        email: req.body.email
    };

    students.push(student);
    res.send(student);
});

app.put('/api/student/:adm', (req, res)=>{
    const student = students.find( student => student.adm===parseInt(req.params.adm));
    console.log(student)
    if(!student) return res.status(404).send(`Student with adm: ${req.params.adm} does not exist`);
    
    const { error } = validateStudent(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    student.name = req.body.name
    student.email = req.body.email

    res.send(student);
});

app.delete('/api/student/:adm', (req, res)=>{
    const student = students.find( student => student.adm===parseInt(req.params.adm));
    if(!student) return res.status(404).send("Student with adm does not exist");

    const index = students.indexOf(student)
    students.splice(index, 1);
    res.send(student);
})

// Validate Function
function validateStudent(course){
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().min(5).required()
    }
    return Joi.validate(course, schema)
}

// Students section




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


console.log(app.get('env'))
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on Port ${port}...`))



