const express = require('express');
const Joi = require('joi');
const router = express.Router();


const students = [{
    adm: 100,
    name: "Joachim",
    email: "joachimoyugi@gmail.com"
},
{
adm: 101,
name: "Mary",
email: "maryg3@gmail.com"
}
]

router.get('/', (req, res)=>{
    res.send(students);
});

router.get('/:adm', (req, res)=>{
    const student = students.find(student => student.adm === parseInt(req.params.adm))

    if(!student) return res.status(404).send("Student with that ID does not exist")
    
    res.send(student);
})

router.post('/', (req, res)=>{
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

router.put('/:adm', (req, res)=>{
    const student = students.find( student => student.adm===parseInt(req.params.adm));
    console.log(student)
    if(!student) return res.status(404).send(`Student with adm: ${req.params.adm} does not exist`);
    
    const { error } = validateStudent(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    student.name = req.body.name
    student.email = req.body.email

    res.send(student);
});

router.delete('/:adm', (req, res)=>{
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


module.exports = router;
