const mongoose= require("mongoose");
const schema = mongoose.Schema;


const reviewSchema = new schema({
    rating: {type: Number,min: 1, max: 5},
    comment: {type: String },
    createdAt: {type: Date, default: Date.now()},
    postBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"}
});

module.exports = mongoose.model('Review', reviewSchema);