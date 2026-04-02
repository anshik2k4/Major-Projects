const mongoose =require("mongoose");
// requiring our listing database
const Listing=require("../model/listing.js");
let  initdata=require("./data.js");

main().then(res=>{
    console.log("Database Connection Successfull");
}).catch(err => console.log("Error in Database connection"));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/StayHub');
}


// creating function for inserting the database

const initdb= async ()=>{
  //  await Listing.deleteMany();
   initdata.data=initdata.data.map((obj)=>({...obj, // purani saari fields rakho
    owner:"69adb988d471afc4baf6a3b2"}));  // har listing mein owner add karo
    await Listing.insertMany(initdata.data); // ek saath insert
    console.log("data inserted");
}
initdb();
