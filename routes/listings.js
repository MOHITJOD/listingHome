const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const methodOverride = require("method-override");
const { isLog , validateListing, isOwner } = require("../loginMiddleware.js");
const routeController = require("../controller/listing.js");
//  const passport = require("passport");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); 

//index route
router.route("/")
.get(routeController.allListings)
.post( isLog , validateListing , upload.single('listing[image]'), routeController.addPost);

//add new
router.get("/add", isLog , routeController.newListing); 


router.route("/:id")
.get( routeController.showList)//full route
.put(isLog,isOwner,upload.single('listing[image]'),validateListing, routeController.editPost)//update
.delete(isLog,isOwner,routeController.delete); //delete route
//edit route
router.get("/:id/edit",isLog,isOwner,routeController.editPage);

router.get("/:id/weather", routeController.weather);

module.exports = router;