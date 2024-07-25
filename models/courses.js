const mongoose = require('mongoose');
const Joi = require('joi');
const { required } = require('joi/lib/types/lazy');
const { unique } = require('joi/lib/types/array');
const {StudentsSchema} = require('./students');


const CourseSchema = mongoose.Schema({
    code: {type: String,
            required: true,
            minLength: [2, 'Too short'],
    },
    name: {
        type: String,
        required: true,
        maxLength: 255
    }
})

const Course = mongoose.model('Course', CourseSchema)



// Validate Function
function validateCourse(course){
    const schema = {
        code : Joi.string().min(2).required(),
        name: Joi.string().max(255).required()  
    }
    return Joi.validate(course, schema)
}





exports.CourseSchema=CourseSchema;
exports.Course = Course;
exports.validateCourse = validateCourse;