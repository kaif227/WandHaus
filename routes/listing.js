const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")




//Index route
router.get("/",wrapAsync(async (req, res) => {
    const allListings =  await Listing.find({})
    res.render("listings/index.ejs", { listings: allListings });
}));

// New route to render the form for creating a new listing
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//create route to create a new listing
router.post("/",
    isLoggedIn,
    validateListing,//This is the middleware that validates the listing data before creating a new listing.using Joi for schema validation
    wrapAsync(async (req, res) => {
    const newListing =  new Listing(req.body.listing); 
    console.log(req.user)
    newListing.owner = req.user._id//is line se ye pata chelega who created this listing and we can use it to show the owner of the listing in show.ejs otherwise we have to face the problem of showing the owner of the listing
    await newListing.save();
    req.flash("success", "New listing created successfully!"); 
    res.redirect("/listings"); 
}));

//show route to render the individual listing page
router.get("/:id",
    wrapAsync( async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate('review').populate("owner")//This line finds the listing by its ID and populates the review field with the associated reviews.
    if (!listing){
        req.flash("error","Listing you are requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: listing });
}));

//Edit route to render the form for editing a listing
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
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
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync( async (req, res) => {
     let {id} = req.params;
     //isOwner check karega ki ye listing ka owner kya hai before updating
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));
//Delete route to delete a listing
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync( async (req, res) =>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));



// Export the router to use in app.js
module.exports = router;
