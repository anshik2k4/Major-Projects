const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const AppError = require("../public/js/Error.js");
const catchAsync = require("../public/js/wrapper.js");

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: "You need to login first!" });
};

const isReviewAuthor = catchAsync(async (req, res, next) => {
    const { listingId, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({ error: "Review not found!" });
    }

    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ error: "You are not authorized to delete this review!" });
    }

    next();
});

router.post("/", isAuthenticated, catchAsync(async (req, res) => {
    const { comment, rating } = req.body;
    const listingId = req.params.listingId;

    if (!comment || comment.trim().length < 10) {
        throw new AppError("Comment must be at least 10 characters", 400);
    }

    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
        throw new AppError("Rating must be between 1-5", 400);
    }

    const listing = await Listing.findById(listingId);
    if (!listing) throw new AppError("Listing not found", 404);

    const review = new Review({
        comment: comment.trim(),
        rating: Number(rating),
        author: req.user._id,
    });

    await review.validate();
    const savedReview = await review.save();
    listing.reviews.push(savedReview._id);
    await listing.save();

    const populatedReview = await Review.findById(savedReview._id).populate(
        "author",
        "username"
    );

    res.status(201).json({ review: populatedReview });
}));

router.delete("/:reviewId", isAuthenticated, isReviewAuthor, catchAsync(async (req, res) => {
    const { listingId, reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    const listing = await Listing.findById(listingId);
    if (!listing) throw new AppError("Listing not found", 404);
    listing.reviews.pull(reviewId);
    await listing.save();

    res.json({ message: "Review deleted successfully!" });
}));

module.exports = router;
