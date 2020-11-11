let generateResponse = (isError,status,errorMessage,successMessage) =>{
    
    let response = {
      error: isError,
      message: errorMessage,
      status: status,
      data: successMessage
    };    
    

    return response;

};// end generate response. 

module.exports = {generateResponse:generateResponse};

/*

Complete the Express application that runs on port 3000 and connects to a Database assignment. 
The database should have a user collection which contains the following user details. 

  a) userId - "user1",
  firstName - "Akshay",
  lastName - "Kumar",
  email - "khiladi@gmail.com"

  b) userId - "user2"
	firstName - "Rajnikanth",
	lastName - "",
	email - "boss@rajnikanth.com"

  The application should have the following api - 
  /users - returns the JSON of all users in the DB
  /users/:userId - returns the object of a single user based on the userId passed

Edit the following files in the given application - 
response.js
app.js

And make this a fully functional REST API with following two kind of responses - 
a) Error response - 
  {‘isError’:true,'status’: 500,'errorMessage':’Some error message’,successMessage:null}
b) Success response - 
{‘isError’:false,'status’: 200,'errorMessage':null,successMessage:’Some result’}

NOTE: You are not required to use app.listen(<port>). This will be handled by the system.

*/

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserModel1 = require('./User.js');

const UserModel = mongoose.model('User');

let db = mongoose.connect('mongodb://testuser:password123@ds149252.mlab.com:49252/assignment', { useMongoClient: true });

const responseLib = require('./responseLib');



let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = responseLib.generateResponse(true, 500, 'Failed To Find User Details', null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                let apiResponse = responseLib.generateResponse(true, 500, 'No User Found', null);
                res.send(apiResponse);
            } else {
                let apiResponse = responseLib.generateResponse(false, 200, null, result);
                res.send(apiResponse);
            }
        });
};// end get all users

/* Get single user details */
let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = responseLib.generateResponse(true, 500, 'Failed To Find User Details', null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                let apiResponse = responseLib.generateResponse(true, 500, 'No User Found', null);
                res.send(apiResponse);
            } else {
                let apiResponse = responseLib.generateResponse(false, 200, null, result);
                res.send(apiResponse);
            }
        });
};// end get single user

app.get('/users', getAllUser);


// params: userId.
app.get('/users/:userId', getSingleUser);


module.exports = app;


// importing mongoose module
const mongoose = require('mongoose');
// import schema 
const Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        userId: {
            type: String,
            unique: true
        },
        firstName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        }
    }
);

mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);