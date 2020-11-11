const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const request = require("request")
const Auth = mongoose.model('Auth')

const logger = require('./../libs/loggerLib')
const responseLib = require('./../libs/responseLib')
const token = require('./../libs/tokenLib')
const check = require('./../libs/checkLib')

let isAuthorized = (req, res, next) => {
  // console.log('Pratik Authenticating...')
  
  let headerAuthKey = null;
  
  // if(req.header('authorization')){
  //   try {
  //     console.log(req.header('authorization'));
  //     console.log(req.header('authorization').split(' '))

  //     headerAuthKey = req.header('authorization').split(' ')[1];
  //   } catch (error) {
  //     headerAuthKey = null
  //   }
  // }

  headerAuthKey = req.header('authorization');

  // console.log(headerAuthKey);

  // console.log(headerAuthKey);
  // process.exit(0);
  // console.log('Auth Key: ' + headerAuthKey);

  if (!headerAuthKey){
      headerAuthKey = req.query.authToken;
  }

  if(!headerAuthKey){
    headerAuthKey = req.params.authToken;
  }

  if(!headerAuthKey){
    headerAuthKey = req.body.authToken;
  }

  if (headerAuthKey) {
    headerAuthKey = headerAuthKey.split(' ');

    if(headerAuthKey.length > 1){
      headerAuthKey = headerAuthKey[1];
    }

    Auth.findOne({authToken: headerAuthKey}, (err, authDetails) => {
      if (err) {
        // console.log('Pratik Auth not found in header...')
        console.log(err)
        logger.error(err.message, 'AuthorizationMiddleware', 10)
        let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(authDetails)) {
        console.log('Pratik Auth Empty...')
        logger.error('No AuthorizationKey Is Present', 'AuthorizationMiddleware', 10)
        let apiResponse = responseLib.generate(true, 'Invalid Or Expired AuthorizationKey', 404, null)
        res.send(apiResponse)
      } else {
        token.verifyClaimWithoutSecret(authDetails.authToken,(err,decoded)=>{

            if(err){
              console.log('Pratik Auth not valid...')
                logger.error(err.message, 'Authorization Middleware', 10)
                let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
                res.send(apiResponse)
            }
            else{
                console.log('Pratik AuthToken found...')    
                req.user = {userId: decoded.data.userId}
                next()
            }


        });// end verify token
       
      }
    })
  } else {
    logger.error('AuthorizationToken Missing', 'AuthorizationMiddleware', 5)
    let apiResponse = responseLib.generate(true, 'AuthorizationToken Is Missing In Request', 400, null)
    res.send(apiResponse)
  }
}


module.exports = {
  isAuthorized: isAuthorized
}
