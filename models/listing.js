
const mongoose= require("mongoose");
const reviews = require("./reviews");
const schema = mongoose.Schema;
const defaultImageUrl = "https://i.pinimg.com/736x/4c/78/4f/4c784f33a7e20b7260407b9975b982d0.jpg";
const review = require("./reviews");
const { string } = require("joi");

const listingSchema = new schema({
    title:{
        type:String,
        required : true,
    },

    description: {
        type:String,
        required : true,
    },

    image: {
        url:String,
        filename:String, 
        // default: defaultImageUrl,
    },
    
   price : {
        type:Number,
        min: 1,
        required : true,
    },
    location:{
        type:String,
        required : true,
    },
    country:{
        type:String,
        required : true,
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          default:"Point",
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}})
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;



