'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  const crypto = require('crypto');

let UserSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
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
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  avataar: {
    type: String,
    default: ''
  },
  watchList: [],
  hash : String, 
  salt : String,
  createdOn :{
    type:Date,
    default: Date.now()
  }
});

UserSchema.methods.setPassword = function(password) { 
     this.salt = crypto.randomBytes(16).toString('hex'); 
   
     this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
 }; 
   
 UserSchema.methods.validatePassword = function(password, callBack) { 
    try {
      let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex'); 
     
      if(this.hash === hash){
        return callBack(null, true);
      } 
      else{
        return callBack(null, false);
      }
    } catch (error) {
      return callBack(error, false);
    }   
 }; 

mongoose.model('User', UserSchema);