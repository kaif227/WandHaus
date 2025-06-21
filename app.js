const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 8080;
const app = express();
const Listing = require('./models/listing');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require('./utils/ExpressError.js');
const Joi = require('joi');//for schema validation
const { listingSchema } = require('./schema.js');


const MONGO_URL = 'mongodb://127.0.0.1:27017/wandHaus'
main()
.then(() =>{
    console.log("MongoDB is connected")
})
.catch((err) => {
    console.log(err);
});

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.engine('ejs', ejsMate); // using ejs-mate as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'))

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Welcome to the Home Page!");
});

//index route to render the listings page
app.get("/listings",wrapAsync(async (req, res) => {
    const allListings =  await Listing.find({})
    res.render("listings/index.ejs", { listings: allListings });
}));

//create route or new route to render the form for creating a new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})
app.post("/listings", wrapAsync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error.details[0].message);
    }
        const newListing =  new Listing(req.body.listing); 

        await newListing.save();
        res.redirect("/listings"); 
}))
//show route to render the individual listing page
app.get("/listings/:id",wrapAsync( async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing: listing });
}));
//edit route to render the form for editing a listing
app.get("/listings/:id/edit",wrapAsync( async (req, res) =>{
    const {id}= req.params;
    const listing = await Listing.findById(id);  
    res.render("listings/edit.ejs", {listing });
}));  
//update route to update a listing  
app.put("/listings/:id/edit",wrapAsync( async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});//we use ...req.body.listing to spread the properties of the listing object
    // This allows us to update the listing with the new values from the form.
    res.redirect(`/listings/${id}`);
}));
//delete route to delete a listing
app.delete("/listings/:id",wrapAsync( async (req, res) =>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(400,"Page Not Found"));
});


//404 route to handle not found pages
app.use((err,req,res,next)=>{
    const{statusCode=500, message="Something went wrong"} = err;
    res.render("error.ejs", { message });    
})//This is is the error handling middleware that catches any errors that occur in the application and renders an error page with the status code and message.


app.listen(port, () => {
     console.log(`Server is running on ${port}`);
});