const express = require("express");
const router = express.Router();
const User= require("../models/user.js"); 


module.exports.createUserPage = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.createUser =  async (req,res)=>{
    try{let {username,email,password} = req.body;
    const newU = new User ({email, username}); 
   const registered = await User.register(newU,password);
    console.log(registered);
    req.login(registered,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Account created successfully sir!");
    res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error","User account already exists, try to login sir!");
        res.redirect("/signup") 
    }
}

module.exports.logPage = (req,res)=>{
    res.render("listings/home.ejs")
}

module.exports.logUser= async(req,res)=>{
    req.flash("success","Welcome back to the fake-AirBNB noob i mean sir!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Bye bye sir! LoggedOut!");
        res.redirect("/listings");
    })
}