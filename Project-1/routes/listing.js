const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const {
    CATEGORY_BAR_ITEMS,
    isValidCategory,
} = require("../constants/listingCategories.js");

const categoryFormOptions = CATEGORY_BAR_ITEMS.filter((c) => c.id);

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSearchQuery(req) {
    const raw = req.query.q;
    if (raw == null) return "";
    const s = Array.isArray(raw) ? raw[0] : raw;
    return typeof s === "string" ? s.trim() : String(s).trim();
}

function buildListingSearchFilter(q) {
    const tokens = q
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);
    if (!tokens.length) return null;

    const fieldMatch = (token) => {
        const pattern = escapeRegex(token);
        const rx = { $regex: pattern, $options: "i" };
        return {
            $or: [
                { title: rx },
                { location: rx },
                { country: rx },
                { description: rx },
            ],
        };
    };

    if (tokens.length === 1) {
        return fieldMatch(tokens[0]);
    }
    return { $and: tokens.map(fieldMatch) };
}

function buildListingsQuery(query) {
    const raw = query.category;
    let categoryFilter = null;
    let selectedCategory = null;

    if (raw && raw !== "all" && isValidCategory(raw)) {
        selectedCategory = raw;
        if (raw === "city") {
            categoryFilter = {
                $or: [
                    { category: "city" },
                    { category: { $exists: false } },
                    { category: null },
                ],
            };
        } else {
            categoryFilter = { category: raw };
        }
    }

    const q = getSearchQuery({ query });
    let searchFilter = null;
    if (q) {
        searchFilter = buildListingSearchFilter(q);
    }

    let filter = {};
    if (categoryFilter && searchFilter) {
        filter = { $and: [categoryFilter, searchFilter] };
    } else if (categoryFilter) {
        filter = categoryFilter;
    } else if (searchFilter) {
        filter = searchFilter;
    }

    return { filter, selectedCategory, searchQuery: q };
}

const AppError = require("../public/js/Error.js");
const catchAsync = require("../public/js/wrapper.js");
const multer = require("multer");
const { storage } = require("../Cloudinary.js");
const upload = multer({ storage });

async function findListingWithReviews(id) {
    return Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
    });
}

async function geocodeListing(title, location, country) {
    let query = `${title}, ${location}, ${country}`;
    let geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { "User-Agent": "StayHub/1.0 (anshikkumarak@gmail.com)" } }
    );
    let geoData = await geoRes.json();

    if (!geoData.length) {
        query = `${location}, ${country}`;
        geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
            { headers: { "User-Agent": "StayHub/1.0 (anshikkumarak@gmail.com)" } }
        );
        geoData = await geoRes.json();
    }

    return {
        lat: geoData[0]?.lat || null,
        lon: geoData[0]?.lon || null,
    };
}

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: "You need to login first!" });
};

const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }
    next();
};

const isOwner = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
    }
    const ownerId = listing.owner._id || listing.owner;
    if (!ownerId.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not authorized to do this!" });
    }
    next();
});

router.get("/api", catchAsync(async (req, res) => {
    const { filter, selectedCategory, searchQuery } = buildListingsQuery(req.query);
    const listings = await Listing.find(filter);
    res.json({
        listings,
        selectedCategory,
        categoryBarItems: CATEGORY_BAR_ITEMS,
        searchQuery,
    });
}));

router.get("/api/form-options", (req, res) => {
    res.json({ categoryOptions: categoryFormOptions });
});

router.get("/api/:id", validateObjectId, catchAsync(async (req, res) => {
    const listing = await findListingWithReviews(req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing Not Found" });
    }
    res.json({ listing });
}));

router.post("/", isAuthenticated, upload.single("image"), catchAsync(async (req, res) => {
    const { title, description, price, location, country, category } = req.body;
    const owner = req.user._id;

    if (!title || !description || !price || !location || !country) {
        throw new AppError("All fields are required", 400);
    }
    if (!req.file) {
        throw new AppError("Image is required", 400);
    }

    const listingCategory = isValidCategory(category) ? category : "city";
    const coordinates = await geocodeListing(title, location, country);

    const newlisting = new Listing({
        title,
        description,
        image: {
            url: req.file.path,
            filename: req.file.filename,
        },
        price,
        location,
        country,
        owner,
        coordinates,
        category: listingCategory,
    });

    await newlisting.save();
    res.status(201).json({
        listing: newlisting,
        message: "Listing added successfully",
    });
}));

router.put("/:id", isAuthenticated, validateObjectId, isOwner, upload.single("image"), catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!req.body.title || !req.body.price) {
        throw new AppError("Required fields missing", 400);
    }

    const coordinates = await geocodeListing(
        req.body.title,
        req.body.location,
        req.body.country
    );

    const listingCategory = isValidCategory(req.body.category)
        ? req.body.category
        : "city";

    const updateData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        location: req.body.location,
        country: req.body.country,
        coordinates,
        category: listingCategory,
    };

    if (req.file) {
        updateData.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    const updated = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) throw new AppError("Listing Not Found", 404);

    res.json({
        listing: updated,
        message: "Listing updated successfully!",
    });
}));

router.delete("/:id", isAuthenticated, validateObjectId, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new AppError("Listing Not Found", 404);
    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully!" });
}));

module.exports = router;
