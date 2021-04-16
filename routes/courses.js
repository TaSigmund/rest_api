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
        if (error.name === 'SequelizeValidationError'){
          error.status = 400;
          const errors = error.errors.map(err => err.message); //iterates over the errors property of the validation error
        }
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
  if (course){
  res.status(200).json(course)
  }
  else {
    next() // 404 for non-existent id
  }
}));

/***
 * create a new course
 ***/
router.post('/', authenticateUser, asyncHandler(async (req, res, next)=>{
    const createCourse = await Course.create(req.body);
    const lastEntry = await Course.findOne({ 
      order: [ [ 'createdAt', 'DESC' ]] //finds the newest entry in the database
    });
    res.status(201).location(`/api/courses/${lastEntry.id}`).end(); //sets status and sets location header to a path for the newest course
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
    else {
      await courseToUpdate.update(req.body);
      res.status(204).end();
    }
  }
  else{
    next() //404 for non-existent id
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
    next() //404 for non-existent id
  }
}));


module.exports = router;