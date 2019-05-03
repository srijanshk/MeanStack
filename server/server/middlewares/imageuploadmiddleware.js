const multer = require('multer');


var MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}

var storage = multer.diskStorage({
    
    destination: function(req, file, cb) {
        var isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-'  + file.originalname);
    }
});

const upload = multer({
    storage : storage,
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

module.exports = upload;