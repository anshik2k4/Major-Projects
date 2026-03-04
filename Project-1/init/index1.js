const mongoose =require("mongoose");
// requiring our listing database
const Listing=require("../model/listing.js");
const initdata=require("./data.js");

main().then(res=>{
    console.log("Database Connection Successfull");
}).catch(err => console.log("Error in Database connection"));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/StayHub');
}


// creating function for inserting the database

const initdb= async ()=>{
   //await Listing.deleteMany();
    await Listing.insertMany(initdata.data);
    console.log("data inserted");
}
initdb();
