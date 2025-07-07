const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedIn } = require("../middleware.js");
const { validateReview, reviewOwner } = require("../loginMiddleware.js");
const reviewControl = require("../controller/review.js");

//review post route
router.post("/", isLoggedIn, validateReview, reviewControl.reviewPost);

//review delete route
router.delete("/:reviewId", isLoggedIn, reviewOwner, reviewControl.reviewDelete);

module.exports = router;