const Listing = require("./models/listing");
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema,reviewSchema} = require('./schema.js');



module.exports.isLoggedIn = (req, res, next) =>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl//ye line next wale middleware ke liye hain
        req.flash("error","you must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
     if(req.session.redirectUrl){//agar req.seesion main koi redirectUrl mean originalUrl save hua hain to us url ko req.local main save kro
        res.locals.redirectUrl = req.session.redirectUrl
     }  
    next()
}
module.exports.isOwner = async(req,res,next)=>{//this middleware is used in like post listings and check is user is owner of listing or not
    //listing.owner is came from model and res.local.currUser is came from local in app.js res.local.currUser = req.user
         let {id} = req.params;
         const listing = await Listing.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)){//this logic for only owner can edit the listing
        // console.log(listing.owner._id,"..",res.locals.currUser._id)
        req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);//this line validates the request body against the Joi schema defined in schema.js.
    //If the validation fails, it will return an error object with details about the validation errors
    if (error) {//If we got an error from the validation, we throw an ExpressError with a 400 status code and the error message.
        let errMsg = error.details.map((el) => el.message).join(', '); 
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);//this line validates the request body against the Joi schema defined in schema.js.
    //If the validation fails, it will return an error object with details about the validation errors
    if (error) {//If we got an error from the validation, we throw an ExpressError with a 400 status code and the error message.
        let errMsg = error.details.map((el) => el.message).join(', '); 
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
 //ye middleware jab bhi ex jab bhi without login new lising create kerte hain to login page open
//  hota but ham jab login ker lete hain to ham wapas create page per hona chahte
//  hain but login ke baad hum listing page per redirect ho jate hain usse bachne 
// ke liye hum is middleware ko use kerte hain
//req.redirectUrl ko req.locals.redirectUrl main save kerte taki locals ko har jagah accessable hote hain jabki req.session.redirectUrl accessable nhi hote and locals ki help se hum redirect ho sake janha ham jana chahte hain