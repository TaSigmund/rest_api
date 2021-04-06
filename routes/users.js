const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../auth-user');

//return the currently authenticated user
router.get('/', authenticateUser, (req, res, next)=>{
    res.status(200).json(req.currentUser).end()
});

//create a new user
router.post('/', (req, res, next)=>{
    res.status(201).location('/').end()
});

module.exports = router;