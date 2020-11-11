const express = require('express');
const router = express.Router();
const blogController = require("./../../app/controllers/blogController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `localhost:${appConfig.port}`;

    // app.post('/blogs/create', auth.isAuthorized, blogController.createBlog);

    // app.get('/blogs/view/all', auth.isAuthorized, blogController.getAllBlogs);

    // app.get('/blogs/view/:blogId', auth.isAuthorized, blogController.getSingleBlog);
}
