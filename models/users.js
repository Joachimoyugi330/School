const jwt = require('jsonwebtoken');
const joiObjectid = require('joi-objectid');
const { required } = require('joi/lib/types/lazy');
const mongoose = require('mongoose');
const Joi = require('joi');

const jwtPrivateKey=process.env.SCHOOL_JWT_PRIVATE_KEY;

const UserSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type:String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },

    isAdmin: Boolean

})

// Creating generate auth token in the user schema as a key value pair
UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: true}, jwtPrivateKey)
    return token;

}

const User = mongoose.model('User', UserSchema);

function validateUser(user){
    const schema ={
        name: Joi.string().min(5).max(50).required(),
        email:Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser= validateUser;