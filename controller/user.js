const express = require("express");
const router = express.Router();
const User= require("../models/user.js"); 


module.exports.createUserPage = (req,res)=>{
    res.render("users/signup.ejs");
}
//signup
module.exports.createUser = async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username, password}); 
        await newUser.save();
        req.flash("success", "Account created successfully!");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error", "User account already exists, try to login!");
        res.redirect("/signup") 
    }
}
//login
module.exports.logPage = (req,res)=>{
    res.render("listings/home.ejs")
}
//login
module.exports.logUser = async(req,res)=>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        
        if(!user || user.password !== password) {
            req.flash("error", "Invalid username or password!");
            return res.redirect("/login");
        }
        
        // Convert Mongoose document to plain object for session storage
        const userObj = user.toObject();
        req.session.user = userObj;
        
        req.flash("success", "Welcome back!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    } catch(e) {
        req.flash("error", "Something went wrong!");
        res.redirect("/login");
    }
}
//logout
module.exports.logOut = (req,res)=>{
    // Set flash message before destroying session
    req.flash("success", "Logged out successfully!");
    
    // Clear the session
    req.session.destroy((err) => {
        if(err) {
            console.log("Error destroying session:", err);
        }
        res.redirect("/listings");
    });
}