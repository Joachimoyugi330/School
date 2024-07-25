const auth = require('../middleware/auth');
const admin = require('../middleware/admin') 
const express = require('express');
const { required } = require('joi/lib/types/lazy');
const router = express.Router();
const {Student, validateStudent} = require('../models/students')



// GET ROUTES
router.get('/', async (req, res)=>{
    const students = await Student.find().sort({name:1});
    res.send(students)
});


router.get('/adm/:adm', async (req, res)=>{
    // const student = students.find(student => student.adm === parseInt(req.params.adm))
    const student = await Student.find({adm: req.params.adm})
    if (!student) return res.status(404).send("Student with that ID does not exist")  
    res.send(student);
})

router.get('/:id', async (req, res)=>{
    // const student = students.find(student => student.adm === parseInt(req.params.adm))
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send("Student with that ID does not exist")  
    res.send(student);
});


// POST route
router.post('/', async (req, res)=>{
    const { error } = validateStudent(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let student = new Student ({
        adm: req.body.adm,
        name: req.body.name,
        email: req.body.email
    });

    student = await student.save();
    res.send(student);
});


// UPDATE routes
router.put('/:id', async (req, res)=>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // const student = students.find( student => student.adm===parseInt(req.params.adm));
    const student = await Student.findByIdAndUpdate(req.params.id,{
        $set:{
            name : req.body.name,
            adm : req.body.adm,
            email : req.body.email
        }
    },
    {new: true});
    
    if(!student) return res.status(404).send(`Student with ID: ${req.params.adm} does not exist`);
    res.send(student);
});

// DELETE routes
router.delete('/:id', [auth, admin], async (req, res)=>{
    // const student = students.find( student => student.adm===parseInt(req.params.adm));
    const student = await Student.findByIdAndDelete(req.params.id)
    if(!student) return res.status(404).send("Student with adm does not exist");

    // const index = students.indexOf(student)
    // students.splice(index, 1);
    res.send(student);
})




module.exports = router;
