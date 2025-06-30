const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema} = require('../schema.js')



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);//this line validates the request body against the Joi schema defined in schema.js.
    //If the validation fails, it will return an error object with details about the validation errors
    if (error) {//If we got an error from the validation, we throw an ExpressError with a 400 status code and the error message.
        let errMsg = error.details.map((el) => el.message).join(', '); 
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//Index route
router.get("/",wrapAsync(async (req, res) => {
    const allListings =  await Listing.find({})
    res.render("listings/index.ejs", { listings: allListings });
}));

// New route to render the form for creating a new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//create route to create a new listing
router.post("/",
    validateListing,//This is the middleware that validates the listing data before creating a new listing.using Joi for schema validation
    wrapAsync(async (req, res) => {
    const newListing =  new Listing(req.body.listing); 
    await newListing.save();
    req.flash("success", "New listing created successfully!"); 
    res.redirect("/listings"); 
}));

//show route to render the individual listing page
router.get("/:id",
    wrapAsync( async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate('review');//This line finds the listing by its ID and populates the review field with the associated reviews.
    if (!listing){
        req.flash("error","Listing you are requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: listing });
}));

//Edit route to render the form for editing a listing
router.get("/:id/edit",
    wrapAsync( async (req, res) =>{
    const {id}= req.params;
    const listing = await Listing.findById(id);
      if (!listing){
        req.flash("error","Listing you are requested for does not exist");
        return res.redirect("/listings");
    }  
    res.render("listings/edit.ejs", {listing });
}));  

//Update route to update a listing  
router.put("/:id/edit",
    validateListing,
    wrapAsync( async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});//we use ...req.body.listing to spread the properties of the listing object
    // This allows us to update the listing with the new values from the form.
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));
//Delete route to delete a listing
router.delete("/:id",
    wrapAsync( async (req, res) =>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

// Export the router to use in app.js
module.exports = router;
