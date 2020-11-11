const express = require('express');
// const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {
    app.post('/users/signup', userController.signUpFunction);
    
    // let baseUrl = `localhost:${appConfig.port}`;

    app.get('/users/view/all', auth.isAuthorized, userController.getAllUser);


    // params: userId.
    app.get('/users/view/:userId', auth.isAuthorized, userController.getSingleUser);

    

    // console.log(`${baseUrl}/users/signup`)
    // params: firstName, lastName, email, mobileNumber, password, apiKey.
    

    app.post('/users/login', userController.loginFunction);

    // app.get('/testAuth', auth.isAuthorized, userController.testAuth);

    app.put('/users/:userId/edit', auth.isAuthorized, userController.editUser);

    app.post('/users/:userId/delete', auth.isAuthorized, userController.deleteUser);

    app.post('/users/logout', auth.isAuthorized, userController.logout);


    app.put('/user/addToWatchList/:issueId/:userId', auth.isAuthorized, userController.addToWatchList);
    app.put('/user/removeFromWatchList/:issueId/:userId', auth.isAuthorized, userController.removeFromWatchList);

}
