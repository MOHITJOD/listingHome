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
const MongoStore = require('connect-mongo');
const User = require("./models/user.js"); 
const flash = require("connect-flash");

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
        throw err;
    }
}

main().then(()=>{
    console.log("connected to database!")
}).catch((err)=>{
    console.log("MongoDB Connection Error:");
    console.log(err);
})

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET,
    },
});

store.on("error", function (err) {
    console.log("SESSION STORE ERROR:", err)
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// Middleware to make user available in templates
app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    // If we have a user in session, convert it back to a Mongoose document
    if (req.session.user) {
        try {
            const user = await User.findById(req.session.user._id);
            res.locals.currUser = user;
        } catch (err) {
            console.log("Error finding user:", err);
            res.locals.currUser = null;
        }
    } else {
        res.locals.currUser = null;
    }
    
    next();
});

app.get('/', (req, res) => {
    res.redirect('/listings');
});

//port setup
app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});

//listing/review routes form other folders
app.use("/listings", listings); 
app.use("/listings/:id/review", reviews);
app.use("/", userRoute);

app.get("/weather", (req, res) => {
    res.render("listings/weather");
});

//error handling middleware
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {status = 500, message = "something went wrong!"} = err;
    res.status(status).render("listings/error.ejs", {message});
});