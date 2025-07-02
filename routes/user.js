const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});
router.post("/signup",async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);//user.register(newUser,password) ye ek passport ka special methiod h jo db main user ko register karta h istead of using user.save() we use user.register() jisme newUser ,newUser h and dusra parameter password compulsury h
        req.login(registeredUser,(err)=>{//jab req.login isliye use kiya kyonki jab bhi koi sinup karta to use wapas login karna padta ab signup ke baad direct login ho jayega
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WandHaus");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
})

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});
router.post("/login",
    saveRedirectUrl,//this middleware is to redirect user to the page they were on before they logged in
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    async(req,res)=>{
    //whenever we are login we use passport.authenticate to check user and there passport is existe in db or nor local is our strategy and we are using local strategy to authenticate user and if user is not authenticate then it will redirect to login page by usign failureRedirect and flash a message by using  failureFlash
    req.flash("success","Welcome back to Wandhaus!")
    let redirectUrl = res.locals.redirectUrl || "/listings"// if we are not passing any redirectUrl(mean simple login ) then it will redirect to /listings if we are passing redirectUrl(mean ex create new Listingd then it tell us first login then we login) then it will redirect to that url 
   res.redirect(redirectUrl)
});

//logged out
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if (err) {
           return next(err)
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");//ye method jab bhi signup kerenge to dobara login nhi krna padega because of this
    });
})

module.exports= router