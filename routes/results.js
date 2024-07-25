const express = require('express')
const router = express.Router();
const { Result, validateResult } = require('../models/results');
const {Student} = require('../models/students');
const {Course} = require('../models/courses');
const Joi = require('joi');
const mongoose = require('mongoose');
const Fawn = require('fawn')

// Fawn.init(mongoose);

router.get('/', async (req, res)=>{
    const result = await Result.find()
    res.send(result);
})

router.post('/', async (req, res)=>{
    const { error } = validateResult(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const student = await Student.findById(req.body.studentId);
    const course = await Course.findById(req.body.courseId);

    if(student==null || course == null) return res.status(400).send('Can not be posted');

    const result = new Result({
        student: {
            _id : student._id,
            adm: student.adm,
            name: student.name,
        },
        course: {
            _id : course._id,
            code: course.code,
            name: course.name
        },
        
        score: req.body.score

    })
    const resultS = await result.save();
    student.year++
    student.save();
    res.send(result);
// Atomicity using npm fawn
// try{
//     new Fawn.Task()
//     .save('results', result)
//     .update('students', {_id: student._id}, {
//         $inc : {year : 1}
//     })
//     .run();
//     // const resultS = await result.save();
//     // student.year++
//     // student.save();
//     res.send(result);
// }
// catch(ex){
//     res.status(500).send("Something failed");
// }

});

// find result by student admission
router.get('/:adm', async (req, res)=>{
    const result = await Result.find({'student.adm' : req.params.adm});
    if(!result) return res.status(404).send("No result found for that ID")
    res.send(result)
})



router.put('/:id', async (req, res)=>{

    const schema = {
        score: Joi.number().integer().min(0).max(100)
    }

//    const {error} = Joi.validate(req.body, schema)
//     if(error) return res.status(400).send(error.details[0].message)

    const result = await Result.findByIdAndUpdate(req.params.id, {
        $set: {
           
            score : req.body.score 
        }
    }, {new: true, runValidators: true}
);
    if(!result) return res.status(404).send("Result not found")
    
    res.send(result);
})

router.delete('/:id', async (req, res)=>{
    const result = await Result.findByIdAndDelete(req.params.id);

    if(!result) return res.status(404).send("Result not found")
    res.send(result);
})

module.exports=router;