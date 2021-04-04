const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(200).json({message: "Here you go..."})
});

router.post('/', (req, res, next)=>{
    res.status(201).json({message: "Alright..."})
});

module.exports = router;