const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');

const userController= require('../controllers/user.js');


router.route("/signup")
.get((req,res)=>{ res.render("users/signup.ejs")})
.post(userController.signup)

router.route("/login")
.get(userController.renderSignupForm)
.post(saveRedirectUrl,//this middleware is to redirect user to the page they were on before they logged in
     passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),
    userController.login);

//logged out
router.get("/logout",userController.logout)

module.exports= router