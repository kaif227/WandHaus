const express = require('express');
const router = express.Router({mergeParams: true}); //mergeParams is used to merge the parameters from the parent route (listings/:id) into this router// This allows us to access the listing ID in the review routes
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {isLoggedIn,validateReview} = require("../middleware.js")


//Review
//Post route
//we use router.get() to define a route that handles GET requests to the /listings/:id/reviews endpoint.
//and we use bcz we did not define app here
router.post("/",
    isLoggedIn,
    validateReview
    ,wrapAsync(async (req,res)=>{
    const {id} = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','Review added successfully');
    res.redirect(`/listings/${id}`);
}));
//Delete route for reviews
router.delete("/:reviewId",
    isLoggedIn,
    wrapAsync(async (req,res)=>{//always use /:id/ one time and second time specify the type of id ex reviewId
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});//This line removes the review ID from the listing's review array.
    //The $pull operator is used to remove elements from an array that match a specified condition
    await Review.findByIdAndDelete(reviewId);//This line deletes the review from the database.
    req.flash('success','Review deleted successfully');
    res.redirect(`/listings/${id}`);

}))


module.exports = router;