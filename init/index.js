//this file is used to initialize the application and all the logic for initializing  the data
const initData = require('./data');
const mongoose = require('mongoose');
const Listing = require('../models/listing');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wandHaus'

main()
.then(() =>{
 console.log("MongoDB is connected")
})
.catch((err) => {
    console.log(err);
});
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // first we need to delete all the data in the database so this line is compulsory
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj)=>({...obj,owner:"686244b5f89291a63c3983b1"}))//mean initData ke data map function ke through har object ko owner denge jiski value 686244b5f89291a63c3983b1 hogi
    // insert the data from the data.js file
    await Listing.insertMany(initData.data);
    // close the connection to the database
    await mongoose.connection.close();
    console.log("Data initialized successfully!");
}
initDB();

