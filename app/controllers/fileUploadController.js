const multer = require('multer');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');

const fs = require('fs')

const path = require('path');

let getIssueFiles = (issueId) => {
    let attachments = [];

    const filePath = path.join(__dirname, '../assets/uploads/' + issueId + '/')
    
    if(!fs.existsSync(filePath)){
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

let uploadFile = (req, res, next) => {
    const store = multer.diskStorage({
        destination: function(request, file, cb){
            cb(null, './app/assets/uploads/' + req.params.issueId);
        },
        filename: function(request, file, cb){
            cb(null, file.originalname);
        }
    });
    
    const upload = multer({storage: store}).single('file');

    upload(req, res, function(err){
        const fileName = req.file.originalname;

        if(err){
            let apiResponse = response.generateFileResponse(true, `Error while uploading ${fileName}`, 501, getIssueFiles(req.params.issueId));

            return res.status(501).json(apiResponse);
        }

        let apiResponse = response.generateFileResponse(false, `File uploaded successfully: ${fileName}`, 200, getIssueFiles(req.params.issueId));

        return res.json(apiResponse);
    });
}


let downloadFile = (req, res, next) => {
    const issueId = req.body.issueId;

    let filePath = path.join(__dirname, '../assets/uploads' + '/' + issueId) + '/' + req.body.fileName;

    res.sendFile(filePath);
}


let deleteFile = (req, res, next) => {
    const fileName = req.body.fileName;
    const issueId = req.body.issueId;

    console.log('Issue ID', issueId);

    let filePath = path.join(__dirname, '../assets/uploads' + '/' + issueId)  + '/' + fileName;

    fs.unlink(filePath, (err) => {
      if (err) {
        let apiResponse = response.generate(true, `Error while deleting the file.`, 501, getIssueFiles(issueId));
        res.send(apiResponse);

    }
      else{
        let apiResponse = response.generate(false, `File deleted successfully.`, 200, getIssueFiles(issueId));
        res.send(apiResponse);
    }
    });
}


module.exports = {
    uploadFile: uploadFile,
    downloadFile: downloadFile,
    deleteFile: deleteFile
}