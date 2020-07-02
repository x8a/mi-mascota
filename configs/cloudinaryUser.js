const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage ({
  cloudinary: cloudinary,
  params: {
    folder: 'mi-mascota/profile-pics',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname
  }
});

module.exports = multer({storage: storage})