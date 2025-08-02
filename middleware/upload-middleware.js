const multer = require('multer');
const path = require('path');

// set up our multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // specify the
    },
    filename: function(req,file,cb){
        cb(null,  
                file.filename + "-" + Date.now() + path.extname(file.originalname) // append the current timestamp to the file name
        )
    }

});

// file filter function to check the file type
const checkFileFiler = (req,file,cb)=>{
    if(file.mimetype.startsWith('image/')) {
        cb(null, true); // accept the file
    }
    else{
        cb(null, false); // reject the file
    }
};
// multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFileFiler,
    limits: {
        fileSize: 1024 * 1024 * 5 // limit the file size to 5MB
    }
});
