const Review = require("../models/review");
const Listing = require('../models/listing.js');

module.exports.createReview = async (req,res)=>{
    const {id} = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
     listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','Review added successfully');
    res.redirect(`/listings/${id}`);
}

//delete Route
module.exports.deleteReview = async (req,res)=>{//always use /:id/ one time and second time specify the type of id ex reviewId
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});//This line removes the review ID from the listing's review array.
    //The $pull operator is used to remove elements from an array that match a specified condition
    await Review.findByIdAndDelete(reviewId);//This line deletes the review from the database.
    req.flash('success','Review deleted successfully');
    res.redirect(`/listings/${id}`);

}