const fs = require("fs");
const path = require("path");

module.exports = function(app){
    
    const returnUtils = require("./return")(app);
    const USER_PHOTO_UPLOAD = 0;
    const EMERGENCY_AUDIO_UPLOAD = 1;

    return {

        USER_PHOTO_UPLOAD, EMERGENCY_AUDIO_UPLOAD,

        /**
         * Do the upload of a file to server
         * @param req Request object
         * @param res Response object
         * @param uploadType Type of upload (user photo or emergency audio)
         * @param callback Callback function
         * @author Cassiano Vellames <c.vellames@outlook.com>
         */
        upload: function(req, res, uploadType, callback){

            // Check file
            if(req.files.file == null){
                callback();
                return;
            }
            
            // Check file extension
            const extension = path.extname(req.files.file.name);
            if(app.core.uploader.ALLOWED_EXTENSIONS.indexOf(extension) === -1){
                callback(returnUtils.getI18nMessage("UPLOADER_INVALID_EXTENSION", req.headers.locale));
                return;
            }

            // Move file to directory
            const tempPath = req.files.file.path;
            
            var basePath;
            switch(uploadType){
                case EMERGENCY_AUDIO_UPLOAD:
                    basePath = app.core.uploader.EMERGENCY_AUDIO_PATH;
                    break;
                case USER_PHOTO_UPLOAD:
                default:
                    basePath = app.core.uploader.USER_PHOTOS_PATH;
                    break;
            }

            const newPath = basePath + req.userInfo.id + extension;
            fs.rename(tempPath, newPath, function(err){
                callback(err ? returnUtils.getI18nMessage("UPLOADER_ERROR", req.headers.locale) : null);
            })
            
        }
    }

}