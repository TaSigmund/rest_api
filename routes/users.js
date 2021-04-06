const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../auth-user');
const {User} = require('../models');
const bcrypt = require('bcrypt');

//return the currently authenticated user
router.get('/', authenticateUser, (req, res, next)=>{
    res.status(200).json(req.currentUser).end()
});

//create a new user
router.post('/', async (req, res, next)=>{
    
    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    //create user
    const createUser = await User.create(req.body);

    //send response
    res.status(201).location('/').end();
});

module.exports = router;