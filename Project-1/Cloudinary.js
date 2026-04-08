const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configure 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || process.env.CLOUD_Name,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Storage setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "StayHub",        // ✅ Cloudinary mein folder naam
        allowed_formats: ["jpg", "jpeg", "png", "webp"], // ✅ Allowed formats
    }
});

module.exports = { cloudinary, storage };