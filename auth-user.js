'use strict';
const auth = require('basic-auth');
const {User} = require('./models');
const bcrypt = require('bcryptjs');

// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = 
async (req, res, next) => {
  const credentials = auth(req); //parse user authorization header
  let message;
  if(credentials){
      const user = await User.findOne({where: {emailAddress: credentials.name}})
        if(user){
            const authenticated = bcrypt.compareSync(credentials.pass, user.password)
            if(authenticated){
                console.log("Authentication successful");
                req.currentUser = user;
            }
            else {
                message = "Authentication failure"
            }
        }
        else{
            message = "User not found."
        }
    }
    else {message = "Authentication header not found"}

    if(message) {
        console.warn(message);
        res.status(401).json({message: 'Access denied'});
    }
    else {
        next();
    }
}