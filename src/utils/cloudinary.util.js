const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

/**
 * Uploads an image to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {string} publicId - The public ID of the file (optional).
 * @returns {Promise<string>} The image URL on Cloudinary.
 */
const uploadImage = (fileBuffer, publicId = null) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            reject(new Error("Error uploading image to Cloudinary"));
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(fileBuffer);
  });
};

module.exports = {
  uploadImage,
};
