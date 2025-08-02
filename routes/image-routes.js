const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const { uploadImage, fetchImageController,deleteImageController } = require("../controller/image-controller");


const router = express.Router();
// const { uploadImage } = require("../controller/image-controller");
// upload the image
router.post("/upload", authMiddleware,adminMiddleware,uploadMiddleware.single("image"), uploadImage);

// to get all the image
router.get("/fetch", authMiddleware, fetchImageController);

// to delete the image 
router.delete("/delete/:id", authMiddleware,adminMiddleware, deleteImageController);


module.exports = router;