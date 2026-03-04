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
    image:{
        type:String,
        //dafault value is for when the image link is not present
        default:"https://unsplash.com/photos/an-aerial-view-of-the-city-of-london-8nVNRt0Ltxg",
        // set function is for when image link is present but is empty
        set:(v)=> v===" "?"https://unsplash.com/photos/an-aerial-view-of-the-city-of-london-8nVNRt0Ltxg":v,
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
  }]

 });

 listingSchema.pre('deleteOne', { document: true }, async function() {
  await Review.deleteMany({ _id: { $in: this.reviews } });
});


 //creating model which contains collection
 const Listing=mongoose.model("Listing",listingSchema);
 //exporting our model
 module.exports=Listing;
 