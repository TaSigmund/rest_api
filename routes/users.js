/***
 * USER ROUTES
 ***/

/***
 * Modules/Dependencies
 ***/
const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../auth-user');
const {User} = require('../models');
const bcrypt = require('bcryptjs');

/***
 * Handler function for routes to avoid repeating try/catch blocks
 ***/

function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch(error){
            if (error.name === 'SequelizeUniqueConstraintError'){//makes sure there is only one account per e-mail address
                error.status = 400;
            }
            next(error) //passes error to global error handler
        }
    }
}

/***
 * return the currently authenticated user
 ***/

router.get('/', authenticateUser, (req, res, next)=>{
    let relevantUserInformation = {
        id: req.currentUser.id, //req.currentUser as defined in the authentication middleware
        firstName: req.currentUser.firstName,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
    }
    res.status(200).json(relevantUserInformation).end()
});

/***
 * create a new user
 ***/
router.post('/', asyncHandler(async(req, res, next)=>{
    if(!req.body.firstName || !req.body.lastName || !req.body.emailAddress || !req.body.password){ //checks for empty strings
        res.status(400).json({error: 'Please provide a full name, e-mail address and password'}); //sends an error message back
    }
    else if (req.body.password.length < 8 || req.body.password.length > 20){//checks password length
        res.status(400).json({error: 'Please provide a password that is between 8 and 20 letters long'}); //sends an error message back
    }
    else{
    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;

    //create user
    const createUser = await User.create(req.body);

    //send response
    res.status(201).location('/').end();}
}));

module.exports = router;