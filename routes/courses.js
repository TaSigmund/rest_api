const express = require('express');
const router = express.Router();
const {Course, User} = require('../models');

// return a list of all courses including any related user data
router.get('/', async (req, res, next)=>{
    const allCourses = await Course.findAll({
        include: [
          {
            model: User,
          },
        ],
      });
    res.status(200).json(allCourses);
});

//return the corresponding course
router.get('/:id', async (req, res, next)=>{
    res.status(200).json({message: "Alright..."})
});

//create a new course
router.post('/', (req, res, next)=>{
    res.status(201).json({message: "Alright..."})
});

//update the corresponding course
router.put('/:id', (req, res, next)=>{
    res.status(204).json({message: "Alright..."})
});

//delete the corresponding course
router.delete('/:id', (req, res, next)=>{
    res.status(204).json({message: "Alright..."})
});


module.exports = router;