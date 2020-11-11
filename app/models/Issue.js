'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let IssueSchema = new Schema({
  issueId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  issueTitle: {
    type: String,
    default: ''
  },
  issueDescription: {
    type: String,
    default: ''
  },
  attachments: [],
  reporter: {
    type: String,
    default: 0
  },
  assignedTo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  createdOn :{
    type:Date,
    default: Date.now()
  },
  lastModifiedOn :{
    type:Date,
    default: Date.now()
  }
});

mongoose.model('Issue', IssueSchema);