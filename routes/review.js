const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLog , validateReview , reviewOwner } = require("../loginMiddleware.js");
const reviewControl  = require("../controller/review.js");


//review post route
router.post("/", isLog , validateReview , reviewControl.reviewPost);

//review delete route
router.delete("/:reviewId", isLog ,reviewOwner, reviewControl.reviewDelete);



module.exports = router;