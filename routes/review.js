const express = require('express');
const router = express.Router({mergeParams: true}); //mergeParams is used to merge the parameters from the parent route (listings/:id) into this router// This allows us to access the listing ID in the review routes
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {isLoggedIn,validateReview, isAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js")


//Review
//Post route
//we use router.get() to define a route that handles GET requests to the /listings/:id/reviews endpoint.
//and we use bcz we did not define app here
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));


//Delete route for reviews
router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(reviewController.deleteReview))


module.exports = router;