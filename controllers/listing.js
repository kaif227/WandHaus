const Listing = require("../models/listing")

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
    const newListing =  new Listing(req.body.listing); 
    console.log(req.user)
    newListing.owner = req.user._id//is line se ye pata chelega who created this listing and we can use it to show the owner of the listing in show.ejs otherwise we have to face the problem of showing the owner of the listing
    await newListing.save();
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
    res.render("listings/edit.ejs", {listing });
}

//Update route
module.exports.updateListing = async (req, res) => {
     let {id} = req.params;
     //isOwner check karega ki ye listing ka owner kya hai before updating
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
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