import { useState } from "react";
import { submitReview } from "../api/reviews";

export default function ReviewForm({ listingId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await submitReview(listingId, { comment: comment.trim(), rating });
      setComment("");
      setRating(0);
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="review-section">
      <h2 className="review-title">Leave a Review</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="rating-group">
          <label className="rating-label">Rating:</label>
          <div className="star-rating">
            {[5, 4, 3, 2, 1].map((value) => (
              <span key={value}>
                <input
                  type="radio"
                  id={`star${value}`}
                  name="rating"
                  value={value}
                  className="star-input"
                  checked={rating === value}
                  onChange={() => setRating(value)}
                />
                <label
                  htmlFor={`star${value}`}
                  className="star"
                  onClick={() => setRating(value)}
                >
                  ★
                </label>
              </span>
            ))}
          </div>
        </div>

        <div className="comment-group">
          <textarea
            name="comment"
            className="review-textarea"
            placeholder="Share your experience..."
            required
            minLength={10}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {error && <p className="text-danger small">{error}</p>}

        <button
          type="submit"
          className="submit-review-btn"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
