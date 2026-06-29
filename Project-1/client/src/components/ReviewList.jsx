import { deleteReview } from "../api/reviews";

export default function ReviewList({ listingId, reviews, currentUser, onChanged }) {
  if (!reviews?.length) {
    return (
      <div className="no-reviews mt-5">
        <h5 className="text-muted text-center">
          No reviews yet. Be the first to review!
        </h5>
      </div>
    );
  }

  async function handleDelete(reviewId) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(listingId, reviewId);
      onChanged();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="reviews-section mt-5">
      <h3 className="reviews-title">
        <i className="fas fa-star me-2 text-warning" />
        {reviews.length} Reviews
      </h3>

      <div className="reviews-list">
        {reviews.map((review) => {
          const isAuthor =
            currentUser &&
            review.author &&
            currentUser._id === review.author._id;

          return (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <span className="review-rating">
                  {review.rating}
                  <i className="fas fa-star text-warning" />
                </span>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              <p className="text-muted small">
                By: {review.author?.username || "Unknown"}
              </p>

              <p className="review-comment">{review.comment}</p>

              {isAuthor && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(review._id)}
                >
                  <i className="fas fa-trash" /> Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
