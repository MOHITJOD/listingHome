const Listing = require("./models/listing.js");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")
const {reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
module.exports.isLog=(req,res,next)=>{
    // console.log(req);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Must login first baby!");
       return res.redirect("/login");
    }next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.validateListing =async (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,msg);
    }
    next();
};


module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Sorry Baby not today!")  
        return res.redirect(`/listings/${id}`);
    }   
    next();
}


module.exports.validateReview =async (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400,msg);
    }
    next();
};

module.exports.reviewOwner = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.postBy.equals(res.locals.currUser._id)){
        req.flash("error","got you its not yours!")
        return res.redirect(`/listings/${id}`);
    }
    next();
} 