const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');

const userController= require('../controllers/user.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});
router.post("/signup",userController.signup)

router.get("/login",userController.renderSignupForm);

router.post("/login",
    saveRedirectUrl,//this middleware is to redirect user to the page they were on before they logged in
    passport.authenticate("local",
        {failureRedirect:"/login",failureFlash:true}),
         userController.login);

//logged out
router.get("/logout",userController.logout)

module.exports= router