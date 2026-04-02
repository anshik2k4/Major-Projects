const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const AppError = require("../public/js/Error.js");
const catchAsync = require("../public/js/wrapper.js");
const multer = require("multer"); // ✅ Multer import ye hume multipart data ko parse krne ki permission deta
const { storage } = require("../Cloudinary.js"); // ← destructure 
const upload = multer({ storage });


// Middlewares
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to login first!");
        res.redirect("/login");
    }
};

const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send("Invalid ID format");
    }
    next();
};

const isOwner = catchAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not authorized to do this!");
        return res.redirect(`/listing/${id}`);
    }
    next();
});

// Index route
router.get("/", catchAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/listing1.ejs", { alllisting });
}));

// New form
router.get("/new", isAuthenticated, (req, res) => {
    res.render("listing/new");
});

// Create
router.post("/", isAuthenticated, upload.single("image"), catchAsync(async (req, res) => {
    let { title, description, price, location, country } = req.body;
    let owner = req.user._id;

    if (!title || !description || !price || !location || !country) {
        throw new AppError("All fields are required", 400);
    }

    let image = {
        url: req.file.path,
        filename: req.file.filename
    };

    // ✅ Pehle title + location try karo
    let query = `${title}, ${location}, ${country}`;
    let geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'StayHub/1.0 (anshikkumarak@gmail.com)' } } // ✅ Email fix
    );
    let geoData = await geoRes.json();

    // ✅ Nahi mila toh sirf location try karo
    if(!geoData.length) {
        query = `${location}, ${country}`;
        geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'StayHub/1.0 (anshikkumarak@gmail.com)' } }
        );
        geoData = await geoRes.json();
    }

    let coordinates = {
        lat: geoData[0]?.lat || null,
        lon: geoData[0]?.lon || null
    };

    const newlisting = new Listing({
        title, description,
        image,
        price, location, country, owner,
        coordinates
    });

    await newlisting.save();
    req.flash("success", "Listing added successfully");
    console.log("Query:", query);
    console.log("GeoData:", geoData);
    console.log("Coordinates:", coordinates);
    res.redirect("/listing");
}));

// Update form
router.get("/:id/update", isAuthenticated, validateObjectId, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    const Listings = await Listing.findById(id);
    if (!Listings) throw new AppError("Listing Not Found", 404);
    res.render("listing/update.ejs", { Listings });
}));

// Update
router.put("/:id", isAuthenticated, validateObjectId, isOwner, upload.single("image"), catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!req.body.title || !req.body.price) {
        throw new AppError("Required fields missing", 400);
    }

    // ✅ Geocoding — update pe bhi coordinates nikalo
    let query = `${req.body.title}, ${req.body.location}, ${req.body.country}`;
    let geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'StayHub/1.0 (anshikkumarak@gmail.com)' } }
    );
    let geoData = await geoRes.json();

    // ✅ Fallback
    if(!geoData.length) {
        query = `${req.body.location}, ${req.body.country}`;
        geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'StayHub/1.0 (anshikkumarak@gmail.com)' } }
        );
        geoData = await geoRes.json();
    }

    let coordinates = {
        lat: geoData[0]?.lat || null,
        lon: geoData[0]?.lon || null
    };

    let updateData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        country: req.body.country,
        coordinates  // ✅ Coordinates update karo
    };

    // ✅ Nai image upload hui toh update karo
    if (req.file) {
        updateData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    const updated = await Listing.findByIdAndUpdate(id, updateData);
    if (!updated) throw new AppError("Listing Not Found", 404);
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listing/${id}`);
}));

// Delete
router.delete("/:id", isAuthenticated, validateObjectId, isOwner, catchAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new AppError("Listing Not Found", 404);
    await listing.deleteOne();
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listing");
}));

// Show
router.get("/:id", validateObjectId, catchAsync(async (req, res) => {
    let { id } = req.params;
    const listinginfo = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'author', select: 'username' }
    });
    if (!listinginfo) return res.status(404).send("Listing Not Found");
    res.render("./listing/show.ejs", { listinginfo });
}));

module.exports = router;