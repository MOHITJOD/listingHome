if(process.env.NODE_ENV != "production"){require('dotenv').config()}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const port = process.env.PORT || 3000;
const dbUrl = process.env.ATLASDB_URL;
const cookieParser = require("cookie-parser");
const listings = require("./routes/listings.js"); 
const reviews = require("./routes/review.js");
const userRoute = require("./routes/users.js");
const session = require("express-session");
const passport = require("passport");
const localStargy = require("passport-local");
const User= require("./models/user.js"); 
const sessionOptions={
    secret: "fppfpsonly", 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge:3 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}
const flash = require("connect-flash");
// const {listingSchema,reviewSchema} = require("./schema.js"); 
// const MONGODB_URI = "mongodb+srv:mohitfpp:wzPdksZi7odEsgiv@cluster0.9avrt0o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
// const Listing = require("./models/listing.js");
// const Review = require("./models/reviews.js");

app.use(express.urlencoded({ extended : true }));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//connect to MongoDB error handling
async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB URL being used:", dbUrl);
    } catch (err) {
        console.log("Error in mongoose.connect:");
        console.log(err);
        throw err; // Rethrow the error to be handled by the caller
    }
}

main().then(()=>{
    console.log("connected to database!")
}).catch((err)=>{
    console.log("MongoDB Connection Error:");
    console.log(err);
})

//connect to MongoDB
async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB URL being used:", dbUrl);
    } catch (err) {
        console.log("Error in mongoose.connect:");
        console.log(err);
        throw err;
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStargy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user; 
    next();
})

// app.get("/demo",async(req,res)=>{
//     let fake = new User({
//         email:"fake@gmail.com",
//         username:"fakeuser",
// })
// let reg = await User.register(fake,"fakepassword");
// res.send(reg);
// })

//port setup
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});

// app.use(cookieParser("secretcode"));

//homepage route
// app.get("/",(req,res)=>{
//     res.render("listings/home.ejs");
// })

//listing/review routes form other folders
app.use("/listings",listings); 
app.use("/listings/:id/review",reviews);

app.use("/",userRoute);

app.get("/weather", (req, res) => {
    res.render("listings/weather");
});

//cookie prectice 
// app.get("/Set",(req,res)=>{
//     res.cookie("name", "Mohit",{signed:true});
//     res.send(`hi`);
// }
// )
// app.get("/cookies",(req,res)=>{
//     let {name ="anonumes"} = req.signedCookies;
//     res.send(`hi ${name}!`);
// }
// )

//error handling middleware
app.all(/.*/, (req, res, next) => {
 next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
let {status=500,message="something went wrong!"}=err;
 res.status(status).render("listings/error.ejs",{message});
});
