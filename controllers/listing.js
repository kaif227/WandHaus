const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index route
module.exports.index = async (req, res) => {
    const allListings =  await Listing.find({})
    res.render("listings/index.ejs", { listings: allListings });
}

// New route to render the form for creating a new listing
module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
}

//show route
module.exports.showListing =  async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner")//This line finds the listing by its ID and populates the review field with the associated reviews.
    if (!listing){
        req.flash("error","Listing you are requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: listing });
}

//Create route
module.exports.createListing = async (req, res) => {
   let response = await geocodingClient.forwardGeocode({
   query: req.body.listing.location,
   limit: 1
}).send()

    const url = req.file.path;//cloudinary hame jo image upload ki h uski link/url or filename degi after image upload so after we will take this from req.file.path
    const filename = req.file.filename;

    const newListing =  new Listing(req.body.listing); 
    newListing.owner = req.user._id//is line se ye pata chelega who created this listing and we can use it to show the owner of the listing in show.ejs otherwise we have to face the problem of showing the owner of the listing
    newListing.image = {url,filename}
    newListing.geometry = response.body.features[0].geometry;//this line will take the geometry from the response of the geocodingClient.forwardGeocode function and store it in the geometry field of the newListing object that we just made in schema.js

     let savedListing =  await newListing.save();
     console.log(savedListing)
    req.flash("success", "New listing created successfully!"); 
    res.redirect("/listings"); 
}

//Edit form route
module.exports.renderEditForm = async (req, res) =>{
    const {id}= req.params;
    const listing = await Listing.findById(id);
     if (!listing){
        req.flash("error","Listing you are requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250")  
    res.render("listings/edit.ejs", {listing,originalImageUrl });
}

//Update route
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    //isOwner check karega ki ye listing ka owner kya hai before updating
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !=="undefined"){//if there is a file then we will update the image
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = {url,filename}
        await listing.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

//delete route
module.exports.destroyListing =  async (req, res) =>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}