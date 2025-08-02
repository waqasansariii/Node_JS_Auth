const fs = require('fs');
const Image = require('../models/image'); // Capitalized model name to avoid conflict
const uploadToCloudinary = require('../helpers/cloudinaryHelper');
const cloudinary = require('../config/cloudinary');

// Upload Image Controller
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path);

        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId // assuming userInfo is added via auth middleware
        });

        await newlyUploadedImage.save();

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully.",
            image: newlyUploadedImage
        });

    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error while uploading image."
        });
    }
};

// Fetch User's Uploaded Images
const fetchImageController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; 
        const skip = (page -1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);
        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if(images){
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            })
        }
        // const userId = req.userInfo.userId;
        // const images = await Image.find({ uploadedBy: userId });

        // res.status(200).json({
        //     success: true,
        //     message: "Images fetched successfully.",
        //     images
        // });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching images."
        });
    }
};

// Delete Image
const deleteImageController = async (req, res) => {
    try {
    

        const imageId = req.params.id;
        const userId = req.userInfo.userId;

        const img = await Image.findById(imageId);

        if (!img) {
            return res.status(404).json({
                success: false,
                message: "Image not found."
            });
        }

        if (img.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this image."
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(img.publicId);

        // Delete from MongoDB
        await Image.findByIdAndDelete(imageId);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting image. Please try again later."
        });
    }
};

module.exports = {
    uploadImage,
    fetchImageController,
    deleteImageController
};
