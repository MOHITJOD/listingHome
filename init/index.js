const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");  
console.log("initData structure:", JSON.stringify(initData, null, 2));


// Connect to MongoDB first
mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    init(); // Call init after successful connection
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  }); 

  
const init = async () => {
    try {
        await Listing.deleteMany({});
        
        // Check if initData is an object with a data property
        const dataToMap = Array.isArray(initData) ? initData : (initData.data || []);
        
        // Map the data and add the new owner
        const mappedData = dataToMap.map((obj) => ({
            ...obj,
            owner: "680f9aa12a429c1c5caa1790"
        }));

        await Listing.insertMany(mappedData);
        console.log("Data initialized successfully!");
    } catch (err) {
        console.error("Error initializing data:", err);
    } finally {
        mongoose.connection.close(); // Close the connection when done
    }
}

// Don't call init() here. It's now called after successful connection.
