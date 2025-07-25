const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{
        url:String,
        filename:String
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    review : [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
      type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }},
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.review}});
    }//this middleware will run after a listing is deleted, and it will delete all reviews associated with that listing.
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
