const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")

//controllers
const listingController = require("../controllers/listing.js");
const { render } = require('ejs');




//Index route
router.get("/",wrapAsync(listingController.index));

// New route to render the form for creating a new listing
router.get("/new",isLoggedIn, listingController.renderNewForm);

//create route to create a new listing
router.post("/",
    isLoggedIn,
    validateListing,//This is the middleware that validates the listing data before creating a new listing.using Joi for schema validation
    wrapAsync(listingController.createListing));

//show route to render the individual listing page
router.get("/:id",
    wrapAsync(listingController.showListing));

//Edit route to render the form for editing a listing
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));  

//Update route to update a listing  
router.put("/:id/edit",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));

//Delete route to delete a listing
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

// Export the router to use in app.js
module.exports = router;
