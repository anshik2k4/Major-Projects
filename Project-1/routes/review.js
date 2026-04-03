const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ mergeParams important hai!
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const AppError = require("../public/js/Error.js");
const catchAsync = require("../public/js/wrapper.js");

// Middlewares
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to login first!");
        res.redirect("/login");
    }
};

const isReviewAuthor = catchAsync(async (req, res, next) => {
    const { listingId, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listing/${listingId}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized to delete this review!");
        return res.redirect(`/listing/${listingId}`);
    }

    next();
});

// Review POST
router.post("/", isAuthenticated, catchAsync(async (req, res) => {
    const { comment, rating } = req.body;
    const listingId = req.params.listingId; // ✅ mergeParams se milega

    if (!comment || comment.trim().length < 10) {
        throw new AppError('Comment must be at least 10 characters', 400);
    }

    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
        throw new AppError('Rating must be between 1-5', 400);
    }

    const listing = await Listing.findById(listingId);
    if (!listing) throw new AppError('Listing not found', 404);

    const review = new Review({
        comment: comment.trim(),
        rating: Number(rating),
        author: req.user._id
    });

    await review.validate();
    const savedReview = await review.save();
    listing.reviews.push(savedReview._id);
    await listing.save();

    req.flash("success", "Review added successfully!");
    res.redirect(`/listing/${listingId}`);
}));

// Review DELETE
router.delete("/:reviewId", isAuthenticated, isReviewAuthor, catchAsync(async (req, res) => {
    const { listingId, reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) throw new AppError('Review not found', 404);

    const listing = await Listing.findById(listingId);
    if (!listing) throw new AppError('Listing not found', 404);
    listing.reviews.pull(reviewId);
    await listing.save();

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listing/${listingId}`);
}));

module.exports = router;