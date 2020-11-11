'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let blogSchema = new Schema({
    blogId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  blogTitle: {
    type: String,
    default: ''
  },
  blogBody: {
    type: String,
    default: ''
  },
  blogCategory: {
    type: String,
    default: ''
  },
  blogTags:[],
  authorName: {
    type: String,
    default: ''
},
  createdBy: {
      type: String,
      default: ''
  },
  createdOn:{
      type: Date,
      default: Date.now()
  },
  modifiedOn:{
    type: Date,
    default: Date.now()
}
});

mongoose.model('Blog', blogSchema);