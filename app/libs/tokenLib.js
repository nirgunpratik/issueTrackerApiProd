const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const secretKey = 'MySecretKey';

let generateToken = (data, cb) => {
    try{
        let claims = {
            jwtid:  shortid.generate(),
            iat: Date.now(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            sub: 'authToken',
            iss: 'testChatApi',
            data: data
        };

        let tokenDetails = {
            token: jwt.sign(claims, secretKey),
            tokenSecret: secretKey
        }

        cb(null, tokenDetails);
    }
    catch(err){
        cb(err, null);
    }
};

let verifyClaim = (token, cb) => {
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            cb(err, null);
        }
        else{
            cb(null, decoded);
        }
    });
};

let verifyClaimWithoutSecret = (token, cb) => {
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            cb(err, null);
        }
        else{
            cb(null, decoded);
        }
    });
};

module.exports = {
    generateToken: generateToken,
    verifyClaim: verifyClaim,
    verifyClaimWithoutSecret: verifyClaimWithoutSecret
};