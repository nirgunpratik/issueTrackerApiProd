const express = require('express');
// const router = express.Router();
const issueController = require("./../../app/controllers/issueController");
// const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {
    app.post('/issue/create', auth.isAuthorized, issueController.createIssue);
    app.post('/issue/update/:issueId', auth.isAuthorized, issueController.updateIssue);
    app.get('/issue/all', auth.isAuthorized, issueController.getAllIssues);
    app.get('/issue/edit/:issueId', auth.isAuthorized, issueController.getSingleIssue);
}
