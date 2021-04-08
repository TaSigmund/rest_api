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

//return the corresponding course including any related user data
router.get('/:id', async (req, res, next)=>{
    const course = await Course.findByPk(
        req.params.id,
        {
        include: [
          {
            model: User,
          },
        ],
      });
    res.status(200).json(course)
});

//create a new course
router.post('/', async (req, res, next)=>{
    const createCourse = await Course.create(req.body);
    const lastEntry = await Course.findOne({order: [ [ 'createdAt', 'DESC' ]]});//finds the newest entry in the database
    res.status(201).location(`/courses/${lastEntry.id}`).json(createCourse); //set status, set location header to a path for the newest course, return json
});

//update the corresponding course
router.put('/:id', async (req, res, next)=>{
    const courseToUpdate = await Course.findByPk(req.params.id);
    const updatedCourse = await courseToUpdate.update(req.body);
    res.status(204).end();
});

//delete the corresponding course
router.delete('/:id', (req, res, next)=>{
    res.status(204).json({message: "Alright..."})
});


module.exports = router;