const mongoose = require('mongoose');
const {CourseSchema} = require('./courses');
const {StudentsSchema} = require('./students');
const Joi = require('joi');
const { required } = require('joi/lib/types/lazy');
Joi.objectId = require('joi-objectid')(Joi);


const ResultSchema = new mongoose.Schema({
    student: StudentsSchema,
    course : CourseSchema,
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }

})

const Result = mongoose.model('Result', ResultSchema);


function validateResult(result){
    const schema = {
        studentId: Joi.objectId().required(),
        courseId: Joi.objectId().required(),
        score: Joi.number().integer().min(0).max(100)
    }
    return Joi.validate(result, schema)
}


exports.Result = Result;
exports.validateResult = validateResult;
exports.ResultSchema = ResultSchema;