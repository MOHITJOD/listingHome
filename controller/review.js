const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");




module.exports.reviewPost = async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.postBy=req.user._id;
    listing.reviews.push(review);
   let rev = await review.save();
    await listing.save();
    console.log("review saved",rev);
    req.flash("success","review added smoothly sir!");
    res.redirect(`/listings/${id}`);
}

module.exports.reviewDelete = async (req,res)=>{
    let {id,reviewId}= req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success","review deleted smoothly sir!");
    res.redirect(`/listings/${id}`);
}