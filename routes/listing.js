const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")
//controllers
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage })//this is line is to initial the multer






router.route("/")
//index route
.get(wrapAsync(listingController.index))
// create route
.post(isLoggedIn,
    validateListing,//This is the middleware that validates the listing data before creating a new listing.using Joi for schema validation
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
)



// New route to render the form for creating a new listing
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
//show route to render the individual listing page
.get(wrapAsync(listingController.showListing))
//update route to update the listing
.put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),//this is to allow the user to upload a new image for the listing and multer upload file ko multer ke through parse karke data send kiya jayega
    validateListing,
    wrapAsync(listingController.updateListing))
//delete route to delete the listing
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing))


//Edit route to render the form for editing a listing
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));  



// Export the router to use in app.js
module.exports = router;
