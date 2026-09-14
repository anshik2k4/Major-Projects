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
const {
    extractStayFilters,
    rankListings,
} = require("../services/geminiStayMatcher.js");

function textFieldFilter(value) {
    return { $regex: escapeRegex(value), $options: "i" };
}

function categoryMongoFilter(category) {
    if (!category) return null;
    if (category === "city") {
        return {
            $or: [
                { category: "city" },
                { category: { $exists: false } },
                { category: null },
            ],
        };
    }
    return { category };
}

function buildAiMongoFilter(filters, { dropPrice = false, dropCategory = false } = {}) {
    const parts = [];

    if (!dropCategory) {
        const cat = categoryMongoFilter(filters.category);
        if (cat) parts.push(cat);
    }

    if (filters.location) {
        parts.push({ location: textFieldFilter(filters.location) });
    }
    if (filters.country) {
        parts.push({ country: textFieldFilter(filters.country) });
    }

    if (!dropPrice) {
        const price = {};
        if (filters.minPrice != null) price.$gte = filters.minPrice;
        if (filters.maxPrice != null) price.$lte = filters.maxPrice;
        if (Object.keys(price).length) parts.push({ price });
    }

    if (filters.keywords.length) {
        parts.push({
            $or: filters.keywords.flatMap((token) => {
                const rx = textFieldFilter(token);
                return [
                    { title: rx },
                    { description: rx },
                    { location: rx },
                    { country: rx },
                ];
            }),
        });
    }

    if (!parts.length) return {};
    if (parts.length === 1) return parts[0];
    return { $and: parts };
}

function orderListingsByRank(listings, ranked) {
    const byId = new Map(listings.map((item) => [String(item._id), item]));
    const ordered = [];
    const seen = new Set();
    const reasons = {};

    for (const item of ranked) {
        const listing = byId.get(item.id);
        if (!listing || seen.has(item.id)) continue;
        seen.add(item.id);
        ordered.push(listing);
        if (item.reason) reasons[item.id] = item.reason;
    }

    for (const listing of listings) {
        const id = String(listing._id);
        if (seen.has(id)) continue;
        ordered.push(listing);
    }

    return { listings: ordered, matchReasons: reasons };
}

async function findListingsForAi(filters) {
    let listings = await Listing.find(buildAiMongoFilter(filters));
    let relaxed = false;

    if (!listings.length && (filters.minPrice != null || filters.maxPrice != null)) {
        listings = await Listing.find(buildAiMongoFilter(filters, { dropPrice: true }));
        relaxed = listings.length > 0;
    }

    if (!listings.length && filters.category) {
        listings = await Listing.find(
            buildAiMongoFilter(filters, { dropPrice: true, dropCategory: true })
        );
        relaxed = listings.length > 0;
    }

    return { listings, relaxed };
}

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

router.post("/api/ai-search", catchAsync(async (req, res) => {
    const rawQuery = req.body?.query;
    const query = typeof rawQuery === "string" ? rawQuery.trim() : "";

    if (query.length < 8) {
        throw new AppError(400, "Describe the stay you want in a bit more detail.");
    }
    if (query.length > 280) {
        throw new AppError(400, "Keep your request under 280 characters.");
    }

    const filters = await extractStayFilters(query);
    const { listings, relaxed } = await findListingsForAi(filters);
    const ranked = await rankListings(query, listings);
    const { listings: ordered, matchReasons } = orderListingsByRank(listings, ranked);

    res.json({
        listings: ordered,
        matchReasons,
        filters,
        relaxed,
        query,
        selectedCategory: filters.category,
        categoryBarItems: CATEGORY_BAR_ITEMS,
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    });
}));

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
