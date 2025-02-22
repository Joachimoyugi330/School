require('dotenv').config();
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const {User} = require('../models/users')
const mongoose = require('mongoose');

const jwtPrivateKey = process.env.SCHOOL_JWT_PRIVATE_KEY;


router.post('/', async(req, res)=>{
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');
    
    // Bcrypt to check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');
    
    const token = user.generateAuthToken();
    res.send({token});
})




function validateUser(req){
    const schema ={
        email:Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}



module.exports=router;