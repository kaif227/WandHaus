const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});
router.post("/signup",async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);//user.register(newUser,password) ye ek passport ka special methiod h jo db main user ko register karta h istead of using user.save() we use user.register() jisme newUser ,newUser h and dusra parameter password compulsury h
        console.log(registeredUser);
        req.flash("success","Welcome to Wandhaus")
        res.redirect("/listings")
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
})

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    //whenever we are login we use passport.authenticate to check user and there passport is existe in db or nor local is our strategy and we are using local strategy to authenticate user and if user is not authenticate then it will redirect to login page by usign failureRedirect and flash a message by using  failureFlash
    req.flash("success","Welcome back to Wandhaus!")
   res.redirect("/listings")
   
})

module.exports= router