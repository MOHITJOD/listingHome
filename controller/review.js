const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.reviewPost = async (req,res)=>{
    try {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        let review = new Review(req.body.review);
        review.postBy = req.session.user._id;
        listing.reviews.push(review);
        
        await review.save();
        await listing.save();
        
        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error adding review:", error);
        req.flash("error", "An error occurred while adding the review.");
        res.redirect(`/listings/${id}`);
    }
}

module.exports.reviewDelete = async (req,res)=>{
    try {
        let {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error);
        req.flash("error", "An error occurred while deleting the review.");
        res.redirect(`/listings/${id}`);
    }
}