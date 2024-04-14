const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res) => {
    console.log("Id of the review is : ",req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //review object will be containg the rating and the feedback
    newReview.author = req.user._id ;
    console.log("**THis is the new review : ",newReview);
    listing.reviews.push(newReview);
  
    const rev = await newReview.save();
    await listing.save();
    req.flash("success" , "New Review created");
    res.redirect(`/listings/${req.params.id}`);
  }

module.exports.destroyReview = async (req,res) =>{
    let {id , reviewId} = req.params ;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleted" , "Review Deleted");
    res.redirect(`/listings/${id}`);
  }