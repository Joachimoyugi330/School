const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const {User, validateUser} = require('../models/users');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const jwtPrivateKey = process.env.SCHOOL_JWT_PRIVATE_KEY;

// Getting current user
// The Id is coming from the web token
router.get('/me', auth, async(req, res)=>{
    const user = await User.findById(req.user._id)
    .select('-password');
    res.send(user);
})

// Logging out user

// It is safe to log out user in thr front end by deleting the web token in the frontend


router.post('/', async(req, res)=>{
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already exists')    
    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // })

    //Lodash
    user = new User(_.pick(req.body, ['name', 'email', 'password']))

    // bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    await user.save();

    // Setting headers with jsonwebtoken for automatic login
    //Lodash
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})



module.exports=router;