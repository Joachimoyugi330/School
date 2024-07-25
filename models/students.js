const mongoose = require('mongoose');
const Joi = require('joi');

const StudentsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    adm: String,
    email: String,
    year: {
        type: Number,
        min: 1,
        default: 1
    },
    isGraduate: Boolean,
    date : {
        type: Date,
        default: Date.now()
    }
});
const Student = mongoose.model('Student', StudentsSchema)

// const Student = mongoose.model('Student', 
//     new mongoose.Schema({
//     name: {type: String, required: true},
//     adm: String,
//     email: String,
//     isGraduate: Boolean,
//     date : Date
// }));



// Validate Function
function validateStudent(course){
    const schema = {
        adm: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().min(5).required(),
        year: Joi.number().min(1)
    }
    return Joi.validate(course, schema)
}

exports.Student = Student;
exports.validateStudent = validateStudent;
exports.StudentsSchema = StudentsSchema;