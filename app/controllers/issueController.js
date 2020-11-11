const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')
const path = require('path');
const fs = require('fs')
// const AuthModel = mongoose.model('Auth')

/* Models */
const IssueModel = mongoose.model('Issue');
const UserModel = mongoose.model('User');

let isInArray = (arr, value) => {
    for(let i=0;i<arr.length;i++){
        if(arr[i]==value) return true;
    };

    return false;
}

let populateUSerAndSend = (res, issueList, userList) => {
    UserModel.find()
             .where('userId')
             .in(userList)
             .select('-password -__v -_id')
             .lean()
             .exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Issue Controller: getUserList', 10)
                } else if (check.isEmpty(result)) {
                    logger.info('No User Found', 'Issue Controller:getUserList')
                } else {
                   let userData = {};

                   for(let i = 0; i<result.length;i++){
                       userData[result[i].userId] = result[i].firstName + ',' + result[i].lastName;
                   }
                   
                   for(let i = 0; i< issueList.data.length;i++){
                    issueList.data[i]['reporterName'] = userData[issueList.data[i]['reporter']];
                    issueList.data[i]['assignedToName'] = userData[issueList.data[i]['assignedTo']];
                   }

                //    console.log('Assigning firstName', issueList);
                   
                   res.send(issueList)
                }
            });
}// end get single user

let getSelectedUsers = (res, issueList)=>{
    selectedUsers = [];

    for (let i = 0; i < issueList.data.length; i++){
       if(!isInArray(selectedUsers, issueList.data[i]['reporter'])){
           selectedUsers.push(issueList.data[i]['reporter']);
       }
       
    }

    for (let i = 0; i < issueList.data.length; i++){
        if(!isInArray(selectedUsers, issueList.data[i]['assignedTo'])){
            selectedUsers.push(issueList.data[i]['assignedTo']);
        }
     }
     
    populateUSerAndSend(res, issueList, selectedUsers);
    // console.log('userData', userData);
}


let getIssueFiles = (issueId) => {
    let attachments = [];

    const filePath = path.join(__dirname, '../assets/uploads/' + issueId + '/')
    console.log('Filepath0', filePath);
    if(!fs.existsSync(filePath)){
        console.log('Creating dir', filePath);
        fs.mkdir(filePath, function(err) {
            if (err) {
              console.log(err)
            } else {
              console.log("New directory successfully created.")
            }
        // console.log(`./../assets/${newUserObj.userId}`);
    });
    }
    
    attachments = fs.readdirSync(filePath);

    return attachments;
    };

let createIssue = (req, res) => {
    let newIssue = new IssueModel({
        issueId: shortid.generate(),
        issueTitle: req.body.issueTitle,
        issueDescription: req.body.issueDescription,
        attachments: [],
        reporter: req.body.reporter,
        assignedTo: req.body.assignedTo,
        status: req.body.status,
        createdOn: time.now(),
        modifiedOn: time.now()
    });

    newIssue.save((err, issue) => {
        if (err) {
            console.log(err);
            logger.error(err.message, 'issueController: createissue', 10);
            let apiResponse = response.generate(true, 'Failed to create issue', 500, null);
            res.send(apiResponse);
        } else {
            let newBlogObj = issue.toObject();
            let apiResponse = response.generate(false, 'Issue created', 200, newBlogObj);

            fs.mkdir(`app/assets/uploads/${newBlogObj.issueId}`, function(err) {
                if (err) {
                  console.log(err)
                } else {
                  console.log("New directory successfully created.")
                }
            // console.log(`./../assets/${newUserObj.userId}`);
        });

            res.send(apiResponse);
        }
    });
}

let getAllIssues = (req, res) => {
    IssueModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Issue Controller: GetAllIssues', 10)
                let apiResponse = response.generate(true, 'Failed To find issue details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty (result)) {
                logger.info('No blog found', 'Issue Controller: GetAllIssues')
                let apiResponse = response.generate(true, 'No issue Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All issue Details Found', 200, result);
                getSelectedUsers(res, apiResponse);
                // userDetails = getSelectedUsers(result);
                // console.log(userDetails);

                // apiResponse['userData'] = userDetails;

                // res.send(apiResponse)
            }
        })
}// end get all users

let getSingleIssue = (req, res) => {
    console.log(req.params.issueId );
    IssueModel.findOne({ 'issueId': req.params.issueId })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Issue Controller: getSingleIssue', 10)
                let apiResponse = response.generate(true, 'Failed To Find issue Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Issue Controller:getSingleIssue')
                let apiResponse = response.generate(true, 'No issue Found', 404, null)
                res.send(apiResponse)
            } else {
                let responseSet = {
                    issueData: result,
                    attachments: getIssueFiles(req.params.issueId)
                }

                let apiResponse = response.generate(false, 'Issue Details Found', 200, responseSet);
                res.send(apiResponse)
            }
        });
}// end get single user

let updateIssue = (req, res) => {
    let options = req.body;
    console.log('update called', req.params.issueId)
    IssueModel.updateOne({ 'issueId': req.params.issueId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Issue Controller:updateIssue', 10)
            let apiResponse = response.generate(true, 'Failed To edit Issue details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'Issue Controller: editUser')
            let apiResponse = response.generate(true, 'No issue Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Issue details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user

module.exports = {
    createIssue: createIssue,
    getAllIssues: getAllIssues,
    getSingleIssue: getSingleIssue,
    updateIssue: updateIssue
}// end exports