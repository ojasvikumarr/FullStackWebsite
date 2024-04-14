const express = require("express");
const router = express.Router({mergeParams: true});//merge params is needed so as the id is passed flistings rom the 
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review");


//Create Route
router.post("/",
validateReview,isLoggedIn,
wrapAsync (reviewController.createReview));

//Delete route
router.delete("/:reviewId" ,isLoggedIn ,isReviewAuthor,
  wrapAsync(reviewController.destroyReview))

module.exports = router ;