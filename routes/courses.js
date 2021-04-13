/***
 * COURSES ROUTES
 ***/

/***
 * Modules/Dependencies
 ***/
const express = require('express');
const router = express.Router();
const {Course, User} = require('../models');
const {authenticateUser} = require('../auth-user');

/***
 * Handler function for routes to avoid repeating try/catch blocks
 ***/
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

/*** 
 * return a list of all courses including any related user data
 ***/

router.get('/', asyncHandler(async (req, res, next)=>{
  const allCourses = await Course.findAll({
      attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        },
      ],
    });
  res.status(200).json(allCourses);
}));

/***
 * return the corresponding course including any related user data
 ***/

router.get('/:id', asyncHandler(async (req, res, next)=>{
  const course = await Course.findByPk(req.params.id,
      {
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
          },
        ],
    });
  res.status(200).json(course)
}));

/***
 * create a new course
 ***/
router.post('/', authenticateUser, asyncHandler(async (req, res, next)=>{
  if (!req.body.title || !req.body.description){ //checks for empty strings
    res.status(400).json({error: 'Please provide a title and a description.'}); //sends an error message back
  }
  else{
    const createCourse = await Course.create(req.body);
    const lastEntry = await Course.findOne({ 
      order: [ [ 'createdAt', 'DESC' ]] //finds the newest entry in the database
    });
    res.status(201).location(`/api/courses/${lastEntry.id}`).json(createCourse); //set status, set location header to a path for the newest course, return json
  }
}));

/***
 * update the corresponding course
***/
router.put('/:id', authenticateUser, asyncHandler(async (req, res, next)=>{
  const courseToUpdate = await Course.findByPk(req.params.id);
  if (courseToUpdate !== null){
    if (req.currentUser && req.currentUser.id !== courseToUpdate.userId){ // checks authentication and whether it is the user that owns this course
        res.status(403).json({error: 'You are not authorized to update these course details'});
    }
    else if (!req.body.title || !req.body.description){
        res.status(400).json({error: 'Please provide a title and a description.'});
      }
    else {
      await courseToUpdate.update(req.body);
      res.status(204).end();
      }
  }
  else{
    next() //404 for non-existend id
  }
}));

/***
 * delete the corresponding course
 ***/
router.delete('/:id', authenticateUser, asyncHandler(async (req, res, next)=>{
  const courseToDelete = await Course.findByPk(req.params.id);
  if (courseToDelete){
    if (req.currentUser && req.currentUser.id !== courseToDelete.userId){ // checks authentication and whether it is the user that owns this course
      res.status(403).json({error: 'You are not authorized to delete this course'});
    }
    else{
    await courseToDelete.destroy();
    res.status(204).end();
    }
  }
  else{
    next() //404 for non-existend id
  }
}));


module.exports = router;