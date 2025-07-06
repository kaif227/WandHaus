const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});//THIS CODE is for connect cloudinary with our project these are getting from cloudinary so we can store our images in cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => 'wandhaus_DEV',//wandhaus_dev this is name folder in cloudinary where our images will be stored
    allowedFormats: ['jpg','png','jpeg'],
  },
});

module.exports = {
    cloudinary,
    storage//we wiil use both in routs/listing.js
}