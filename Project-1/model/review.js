const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment required'],
    minlength: [10, 'Min 10 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating required'],
    min: [1, 'Rating 1-5'],
    max: [5, 'Rating 1-5']
  },
  createdAt: {
    type: Date,
    default: Date.now  // ✅ Current date
  }
}, {
  timestamps: false
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
