const auth = require('./../middlewares/auth')
const fileUploadController = require("./../../app/controllers/fileUploadController");

module.exports.setRouter = (app) => {
    app.post('/upload/:issueId', auth.isAuthorized, fileUploadController.uploadFile);
    app.post('/download', auth.isAuthorized, fileUploadController.downloadFile);
    app.post('/delete-file', auth.isAuthorized, fileUploadController.deleteFile);
}
