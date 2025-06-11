// cloudinaryMiddleware.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const sanitize = require("sanitize-filename");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (req, res, next) => { 
  try {
    const files = req.files;

    if (files?.image) {
      const file = files.image[0];
      const baseName = file.originalname.split(".").slice(0, -1).join(".");
      const sanitizedBaseName = sanitize(baseName).substring(0, 50);
      const uniqueFileName = `${uuidv4()}-${sanitizedBaseName}`;

      const result = await cloudinary.uploader.upload(file.path, {
        public_id: uniqueFileName,
        resource_type: "image",
      });

      req.cloudinaryUrl = result.secure_url;
      fs.unlinkSync(file.path); // Clean up temp file
    }

    if (files?.verificationDocument) {
      const file = files.verificationDocument[0];
      const baseName = file.originalname.split(".").slice(0, -1).join(".");
      const sanitizedBaseName = sanitize(baseName).substring(0, 50);
      const uniqueFileName = `${uuidv4()}-${sanitizedBaseName}`;

      const result = await cloudinary.uploader.upload(file.path, {
        public_id: uniqueFileName,
        resource_type: "image",
      });

      req.docUrl = result.secure_url;
      fs.unlinkSync(file.path); // Clean up temp file
    }

    next();
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    return res.status(500).json({ message: "File upload failed" });
  }
};

module.exports = cloudinaryUpload;