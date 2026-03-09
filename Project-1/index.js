
// Requiring up packaages 
const express=require("express");
const app=express();
const path=require("path"); //for joining path
const methodOverride = require("method-override"); // for post delete put requests
const ejsMate=require("ejs-mate"); // to avoid restyling the same thing at multiple route
app.use(methodOverride("_method"));

// to authenticate the user for login and signup 
const passport=require("passport"); 
const localStrategy=require("passport-local"); // 
const User=require("./model/user.js");

//Express sessiomn setup
const session=require("express-session");
const flash=require("connect-flash"); //we are using this to show ine time popup msgs for some new added listing or reviews

const onesession = {
  secret: "Listingsecret",
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 7*24*60*60*1000,   //iss hum information jo save kra rhe uska expiry set kr skte hai ki wo kitne din me expiry hone chaaie example me 7 days baad ye  jo seeion ka ka expiry ho jaayega  mtlb ek session jo 
    httpOnly: true // xxx protection i.e use to prevent from cross scripting 
  }
};

  app.use(session(onesession));
app.use(flash());

// authentication in built feature accessing

// In short passport is a framework andd passport-local ek strategy hai jo user ko ks taike se verify kre 
// passpoert-amazon, passport-spootify, passport- etc ,,,,jiska use krke hum verify user kr ske 
// passport ko use krne se pahle humra session initialized hona chaaie 
app.use(passport.initialize()); // passport ko initailize kiya hummne 
app.use(passport.session()); // passport ko use krne ke liye session ke need hoti hai kuki user ek seesion me aaye login kre to baar baar use 
// login na karna pade jb wo tab switch kre to 
passport.use((new localStrategy(User.authenticate()))); // passport ke andr ko bhi use aaye localstrategy ke through wo authenticate() hoge 
passport.serializeUser(User.serializeUser()); // user jb login kre to uski information ko store krna 
passport.deserializeUser(User.deserializeUser()); // user jb logout kre to uski information ko saved wale databse se htna 

// creating a demo user for login and signup testing 

// app.get("/demo", async(req,res)=>{
//     let demo=new User(
//         {
//     email:"abc@gmail.com",
//     username:"abc" // bhale hi  humne user schema ke andr username define nhi kiya tha 
//     // but due to passport-local ye automatically username create kraa dega 
//         }
        
// );

// let registeredUser= await User.register(demo,"abc123"); // yaha hum demo jisme info store hai aur password pass krenge 
// // also this register method ye automaticallly check kre lge ki username uniquee hai ya nhi 

// console.log(registeredUser);
// res.send("User successfully logged in");

// });


// Flash middleware 
app.use((req, res, next) => {
  res.locals.successmsg = req.flash("success"); //✅ Har request pe automatically set hoga
  res.locals.errormsg = req.flash("error");
  next();
});


// Ejs engine accesing
app.set("view engine","ejs");
app.engine("ejs",ejsMate);


//connecting path
app.set("views",path.join(__dirname,"/views"));
// Using middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));


//defining port
let port=8080;
app.listen(port,()=>{
    console.log("App is listening on port "+port);
});

// Database connection 
const mongoose =require("mongoose");
// requiring our listing database
const Listing=require("./model/listing.js");
const Review=require("./model/review.js");


main().then(res=>{
    console.log("Database Connection Successfull");
}).catch(err => {
        console.log("Error in Database connection:", err);
        process.exit(1); // Server stop karo if DB fails
    });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/StayHub');
}


//Error handling 

const AppError = require("./public/js/Error.js");
const catchAsync = require("./public/js/wrapper.js");




// app.get("/home",(req,res)=>{
//     res.send("Server started");
// });

// index route where all listings will be shown
app.get("/listing",catchAsync(async(req,res)=>{
    const alllisting=await Listing.find({})
     res.render("listing/listing1.ejs",{alllisting});
}));


// Creating new Route for adding details thorugh form 
//  GET: Form dikhane ke liye
app.get("/listing/new", (req, res) => {
    res.render("listing/new");  
});

//  POST:
app.post("/listing",catchAsync(async (req, res) => {
   // console.log(req.body);  // {title: "...", description: "..."}
    
    let { title, description, imageurl, price, location,country } = req.body;

     // ✅ Add validation
    if (!title || !description || !price || !location || !country) {
        throw new AppError("All fields are required", 400);
    }
    
   const newlisting=  new Listing({
        title:title,
        description:description,
        image:imageurl,
        price:price,
        location:location,
        country:country


    });
    await newlisting.save()
    .then(res=>{
        console.log(res);
    })     
    req.flash("success","Listing added succesfully");
    res.redirect("/listing");  // Success → listings page
}));

// Update route to update the existing details


// Middleware for not matching the length of id of listing
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send("Invalid ID format");
    }
    
    next();
};



app.get("/listing/:id/update", validateObjectId,catchAsync(async (req, res) => {
    const { id } = req.params;
    const Listings = await Listing.findById(id);

    if (!Listings) {
        throw new AppError("Listing Not Found", 404);
    }
    res.render("listing/update.ejs", { Listings });
}));

app.put("/listing/:id", validateObjectId, catchAsync(async(req, res) => {
    const { id } = req.params;

     if (!req.body.title || !req.body.price) {
        throw new AppError("Required fields missing", 400);
    }

   const updated=  await Listing.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        image: req.body.imageurl,
        price: req.body.price,
        location: req.body.location,
        country:req.body.country
    });
     // ✅ Check if listing exists
    if (!updated) {
        throw new AppError("Listing Not Found", 404);
    }
    
    req.flash("success", "Listing updated successfully!");


    res.redirect(`/listing/${id}`);
}));


// delete route 

app.delete("/listing/:id",validateObjectId, catchAsync( async(req,res)=>{
let {id}=req.params;

 const listing = await Listing.findById(id);
  if (!listing) throw new AppError("Listing Not Found", 404);
  await listing.deleteOne();  // CASCADE HOOK WORKS!
  req.flash("success", "Listing deleted successfully!");

 res.redirect("/listing");
}));


// show route where the specific listing information will be shown

app.get("/listing/:id",validateObjectId, catchAsync(async(req,res)=>{
    let {id}=req.params;
  const listinginfo=await Listing.findById(id).populate('reviews').lean(); // lean() faster 3x Faster queries (20ms → 7ms),,also less memory use

    if (!listinginfo) {
        return res.status(404).send("Listing Not Found");
    }
  
     res.render("./listing/show.ejs",{listinginfo});  
// console.log(listinginfo);
}));


//REVIEW ROUTE
//(validation ke saath)
app.post('/listing/:id/reviews', catchAsync(async (req, res) => {
  const { comment, rating } = req.body;
  const listingId = req.params.id;
  
  // Server-side validation
  if (!comment || comment.trim().length < 10) {
    throw new AppError('Comment must be at least 10 characters', 400);
  }
  
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
    throw new AppError('Rating must be between 1-5', 400);
  }
  
  // Listing check
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }
  
  // Review create + validate
  const review = new Review({ 
    comment: comment.trim(), 
    rating: Number(rating) 
  });
  await review.validate();  // Mongoose validation
  
  const savedReview = await review.save();
  
  // Listing me add
  listing.reviews.push(savedReview._id);
  await listing.save();
  
  req.flash("success", "Review added successfully!");

  res.redirect(`/listing/${listingId}`);
}));

// DELETE REVIEW ROUTE
app.delete('/listing/:listingId/reviews/:reviewId',catchAsync(async (req, res) => {
  const { listingId, reviewId } = req.params;
  
  // Review find & delete
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }
  
  // Listing se review ID remove karo
  const listing = await Listing.findById(listingId);
  listing.reviews.pull(reviewId);  // 🔥 Array se remove
  await listing.save();
  
  req.flash("success", "Review deleted successfully!");

  res.redirect(`/listing/${listingId}`);
}));


// signup get route 
app.get("/signup",(req, res) => {
    res.render("listing/signup.ejs");
});

// signup post route with error handling 
app.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        
        // Validation
        if (!username.trim() || !email.trim() || !password.trim()) {
    req.flash("error", "All fields are required!");
    return res.redirect("/signup");
}

        if (password.length < 6) {
            req.flash("error", "Password must be at least 6 characters!");
            return res.redirect("/signup");
        }

        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", `Welcome ${username}, You registered Successfully!`);
        res.redirect("/listing");

    }  catch (err) {
    // Username already exists
    if (err.name === "UserExistsError") {
        req.flash("error", "Username already taken, try another!");
        return res.redirect("/signup");
    }
    // Email already exists
    if (err.code === 11000 && err.keyPattern.email) {
        req.flash("error", "Email already registered, try login!");
        return res.redirect("/signup");
    }
    // Baaki errors
    req.flash("error", err.message);
    res.redirect("/signup");
}
});

// Login GET route
app.get("/login", (req, res) => {
    res.render("listing/login.ejs");
});

// Login POST route
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true  // ✅ Automatically error flash set karega
}), (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!`);
    res.redirect("/listing");
});

// Global error middleware

// Manual 404 (sabse safe)
app.use((req,res,next)=>{
   //res.send("Page not found");
    res.status(404).send("Page not found");
});
  
   app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occurred" } = err;
    
    console.error("Error:", err.stack); // Full error log
    
    //  Development vs Production
    if (process.env.NODE_ENV === 'development') {
        res.status(status).send(`
            <h1>Error ${status}</h1>
            <p>${message}</p>
            <pre>${err.stack}</pre>
        `);
    } else {
        res.status(status).send(message);
    }
});






