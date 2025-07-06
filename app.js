if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 8080;
const app = express();
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');



//flash initialization
const session = require('express-session');
const flash = require('connect-flash');

//Passport initialization
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js")//this is user schema

//routers
const listingRouter = require('./routes/listing.js'); //importing the listing routes
const reviewRouter = require('./routes/review.js'); //importing the review routes
const userRouter = require('./routes/user.js'); //importing the user routes

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
app.use(methodOverride('_method'));

const sessionOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000, // 7 days
    maxAge: 7*24*60*60*1000, // 7 days
    httpOnly: true, // prevents client-side JavaScript from accessing the cookie and helps mitigate the risk of cross-site scripting (XSS) attacks
  }
}

//flash middleware
app.use(session(sessionOptions))// session middleware to handle sessions get from npm install express-session
app.use(flash());

//passport middleware
 
app.use(passport.initialize());
app.use(passport.session());//this line means once a user login he dont need to login again
passport.use(new LocalStrategy(User.authenticate()));//User ek model/collection h and ye line user ko localStrategy ke through authenticate karta h

passport.serializeUser(User.serializeUser());//means ye line user ko serialize karta h means user login ker liya to user ki sari detail session main store ho jati jisse user ko baar login nhi karna padta
passport.deserializeUser(User.deserializeUser());//and once use logout or user ne session ko close kiya to user ki sari detail delete ho jati h

//flash will start from here
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user
    next();
    });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Welcome to the Home Page!");
});

// app.get("/demouser",async(req,res)=>{
//   const fakeUser = new User ({
//     email : "arvind@example.com",
//     username : "raman"
//   })
//  let regUser = await User.register(fakeUser,"hello world");
//  console.log(regUser)
// })


//index route to render the listings page related to listing route will render from this route
app.use("/listings",listingRouter)
//Review routes related to review route will render from this route
app.use("/listings/:id/reviews",reviewRouter);
//signup page
app.use("/",userRouter)




//Defaul 404 route to handle any unmatched routes 
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(400,"Page Not Found"));
});

//Default error handling middleware //This is is the error handling middleware that catches any errors that occur in the application and renders an error page with the status code and message.
app.use((err,req,res,next)=>{
    const{statusCode=500, message="Something went wrong"} = err;
    res.render("error.ejs", { message });    
});

app.listen(port, () => {
     console.log(`Server is running on ${port}`);
});