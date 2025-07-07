const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const methodOverride = require("method-override");
const { isLoggedIn } = require("../middleware.js");
const { validateListing, isOwner } = require("../loginMiddleware.js");
const routeController = require("../controller/listing.js");
//  const passport = require("passport");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); 

//index route
router.route("/")
.get(routeController.allListings)
.post(isLoggedIn, validateListing, upload.single('listing[image]'), routeController.addPost);

//add new
router.get("/add", isLoggedIn, routeController.newListing); 

router.route("/:id")
.get(routeController.showList)//full route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, routeController.editPost)//update
.delete(isLoggedIn, isOwner, routeController.delete); //delete route
//edit route
router.get("/:id/edit", isLoggedIn, isOwner, routeController.editPage);

router.get("/:id/weather", routeController.weather);

module.exports = router;