 // All listing and creating Schiema And collection 

 const mongoose=require("mongoose");
 const Schema= mongoose.Schema;
 const Review = require('./review.js'); 

 //schiema define
 const listingSchema=Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image: {
    url: { type: String, default: "" },
    filename: { type: String, default: "" }
    },
    price:{
        type:Number,
        
    },
    location:{
        type:String,
    
    },
    country: {
        type:String,
        
    },
        reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'  // Review model name
  }],
   
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  coordinates: {
    lat: { type: Number },
    lon: { type: Number }
}

 });

 listingSchema.pre('deleteOne', { document: true }, async function() {
  await Review.deleteMany({ _id: { $in: this.reviews } });
});


 //creating model which contains collection
 const Listing=mongoose.model("Listing",listingSchema);
 //exporting our model
 module.exports=Listing;     
 