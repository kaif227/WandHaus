const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//passportLocalMongoose ye hamare liye automatib user and password wale
// field create karega we dont need to define them in our schema
//and ye hamare liye automatic password hashingbhi karega
// hashing means unreadable password ex password = abc after hashing abc = jkdsjkojslkjs) 




const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    //so we dont need to define password and user in our schema
    });
    

    
userSchema.plugin(passportLocalMongoose);//hamene userSchema main plugin main passportLocalMongoose isliye use kiya because ye hamare 
// liye username salting(password ke aage "%?@" add ker de) hashing and password create krega 
//also ye hamare kuch or method bhi create karega you can read in npm passport-local-mongoose documentation


module.exports = mongoose.model("User", userSchema);


