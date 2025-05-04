const Listing = require("../models/listing.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
// const methodOverride = require("method-override");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: token });



module.exports.allListings = async (req,res)=>{
    let allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
    }

   module.exports.newListing =(req,res)=>{
    res.render("listings/add.ejs");
    };

    module.exports.showList=async (req,res)=>{
       let {id}= req.params;
       const listing =await Listing.findById(id).populate({path:"reviews",populate:{path:"postBy"}}).populate("owner");
       if(!listing){
        req.flash("error","listing not exist sir!");
        return res.redirect("/listings");
       }
       res.render("listings/show.ejs",{listing});
    }

    module.exports.addPost = async (req,res)=>{
           let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
            .send();
        let url = req.file.path;
        let filename = req.file.filename;
                    // console.log(url ,"..." ,filename);
                    // let listing = req.body.listing;
                    // if (!listing.image) {
                    //     listing.image = undefined; // Allow Mongoose to apply the default
                    // }
                    // if (!req.body.listing) {
                    // throw new ExpressError(400,"bad request!");
                    // }
        const newList = new Listing(req.body.listing);
        newList.geometry = response.body.features[0].geometry;
        newList.owner= req.user._id;
        newList.image = {url,filename};
        await newList.save();
        console.log(newList);
        req.flash("success","listing added smoothly sir!");
        res.redirect("/listings");
     }
   

    module.exports.editPage= async (req,res)=>{
        let {id}= req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","listing not exist sir!");
            return res.redirect("/listings");
           }
        res.render("listings/edit.ejs",{listing});
    };

    module.exports.editPost = async(req,res)=>{
        try {
            let {id} = req.params;
            let listing = await Listing.findById(id);
            
            if (!listing) {
                req.flash("error", "Listing not found sir!");
                return res.redirect("/listings");
            }

            // Update listing details
            Object.assign(listing, req.body.listing);

            // Update image if a new one is uploaded
            if (req.file) {
                let url = req.file.path;
                let filename = req.file.filename;
                listing.image = {url, filename};
            }

            // Always update geometry
            let response = await geocodingClient.forwardGeocode({
                query: listing.location,
                limit: 1,
            }).send();

            listing.geometry = response.body.features[0].geometry;

            // Save the updated listing
            await listing.save();
            req.flash("success", "Listing edited smoothly sir!");
            res.redirect(`/listings/${id}`);
        } catch (error) {
            console.error("Error updating listing:", error);
            req.flash("error", "An error occurred while updating the listing.");
            res.redirect(`/listings/${id}/edit`);
        }
     } 


    module.exports.delete=async(req,res)=>{
        let {id}= req.params;
       let deleted = await Listing.findByIdAndDelete(id);
        console.log(deleted);
        req.flash("success","listing deleted smoothly sir!");
        res.redirect("/listings");
    }


    module.exports.weather = async(req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","listing not exist sir!");
            return res.redirect("/listings");
        }
        res.render("listings/weather.ejs",{ listing: JSON.stringify(listing) });
    }