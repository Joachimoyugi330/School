const express  = require('express');
const router = express.Router();
const {Course, validateCourse} = require('../models/courses');
const {Student, validateStudent} = require('../models/students')
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async')


// Handling exceptions using asyncMiddleware function
router.get('/', asyncMiddleware(async (req, res, next)=>{ 
   const courses = await Course.find().sort('code');
   res.send(courses);
}));


// Route Parameters
router.get('/:id', async (req, res)=>{
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).send('Course Not Found')
    res.send(course);
})

// MUltiple route parameters
// req.query to read query parameter
router.get('/api/courses/:id/:year', (req, res)=>{
    res.send(req.params)
})


// POST Requests
router.post('/', auth, async (req, res)=>{
    const {error } =  validateCourse (req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const course = new Course({
        code : req.body.code,
        name : req.body.name   
    })
    const result = await course.save();
    res.send(result);
    })



// Update
router.put('/:id', async (req, res)=>{
    const { error } = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const course = await Course.findByIdAndUpdate(req.params.id,{
        $set:{   
            code : req.body.code,
            name : req.body.name,
            score : req.body.score,
        }
    },
        {new: true}
    );

    if(!course) return res.status(404).send('Course does not exist')
    res.send(course);
});

router.delete('/:id', async(req, res)=>{
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if(!course) return res.status(404).send('Course does not exist');
    res.send(course)
})



module.exports=router;