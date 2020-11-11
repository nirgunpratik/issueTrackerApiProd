const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')
// const AuthModel = mongoose.model('Auth')

/* Models */
const BlogModel = mongoose.model('Blog')

let createBlog = (req, res) => {
    let newBlog = new BlogModel({
        blogId: shortid.generate(),
        blogTitle: req.body.blogTitle,
        blogDesc: req.body.blogDesc,
        blogBody: req.body.blogBody,
        blogCategory: req.body.blogCategory,
        blogTags: [],
        createdBy: req.body.userId,
        authorName: req.body.authorName,
        createdOn: time.now(),
        modifiedOn: time.now()
    });

    newBlog.save((err, newBlog) => {
        if (err) {
            console.log(err);
            logger.error(err.message, 'blogController: createblog', 10);
            let apiResponse = response.generate(true, 'Failed to create blog', 500, null);
            res.send(apiResponse);
        } else {
            let newBlogObj = newBlog.toObject();
            let apiResponse = response.generate(false, 'User created', 200, newBlogObj)
            res.send(apiResponse);
        }
    });
}

let getAllBlogs = (req, res) => {
    BlogModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Blog Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find blog Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty (result)) {
                logger.info('No blog found', 'BlogModel Controller: getAllUser')
                let apiResponse = response.generate(true, 'No blog Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users

let getSingleBlog = (req, res) => {
    BlogModel.findOne({ 'blogId': req.params.blogId })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Blog Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Blog Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'Blog Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No Blog Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Blog Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user
module.exports = {
    createBlog: createBlog,
    getAllBlogs: getAllBlogs,
    getSingleBlog: getSingleBlog
}// end exports