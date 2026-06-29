export async function submitReview(listingId, { comment, rating }) {
  const res = await fetch(`/listing/${listingId}/reviews`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ comment, rating }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to submit review");
  }
  return data;
}

export async function deleteReview(listingId, reviewId) {
  const res = await fetch(`/listing/${listingId}/reviews/${reviewId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to delete review");
  }
  return data;
}
