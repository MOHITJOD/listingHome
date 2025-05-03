const express = require("express");
const router = express.Router();
const User= require("../models/user.js"); 
const passport = require("passport");
const {saveRedirectUrl} = require("../loginMiddleware.js");
const userControl = require("../controller/user.js");

router.get("/signup", userControl.createUserPage );

router.post("/signup",userControl.createUser)

router.get("/login", userControl.logPage);

router.post("/login",saveRedirectUrl,
passport.authenticate("local",{ failureRedirect: '/login', failureFlash:true }),
userControl.logUser
);

router.get("/logout", userControl.logOut);

module.exports = router;