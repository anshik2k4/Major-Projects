import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchListing,
  deleteListing,
  getListingImageUrl,
  CATEGORY_LABELS,
} from "../api/listings";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ListingMap from "../components/ListingMap";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

export default function ListingShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadListing = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const listingData = await fetchListing(id);
      setListing(listingData.listing);
    } catch (err) {
      setError(err.message);
      setListing(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  async function handleDelete() {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deleteListing(id);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  const isOwner =
    currentUser &&
    listing?.owner &&
    String(currentUser._id) === String(listing.owner._id || listing.owner);

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-muted py-5">Loading listing…</p>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <p className="text-center text-danger py-5">
          {error || "Listing Not Found"}
        </p>
        <p className="text-center">
          <Link to="/">Back to all listings</Link>
        </p>
      </Layout>
    );
  }

  const lat = listing.coordinates?.lat
    ? Number(listing.coordinates.lat)
    : null;
  const lon = listing.coordinates?.lon
    ? Number(listing.coordinates.lon)
    : null;

  return (
    <Layout>
      <div className="container show-cont">
        <div className="listing-details">
          <h1>You are checking {listing.title}</h1>

          {listing.category && (
            <p className="listing-category-tag">
              <i className="fas fa-tag me-1" aria-hidden="true" />
              {CATEGORY_LABELS[listing.category] || listing.category}
            </p>
          )}

          <img
            src={getListingImageUrl(listing)}
            alt={listing.title}
          />

          <p className="desc">{listing.description}</p>
          <p className="price">₹ {listing.price.toLocaleString("en-IN")}</p>
          <p className="location">
            📍 {listing.location}, {listing.country}
          </p>

          <ListingMap
            lat={lat}
            lon={lon}
            title={listing.title}
            location={listing.location}
          />

          {isOwner && (
            <div className="listing-actions">
              <Link to={`/listing/${listing._id}/update`}>Edit</Link>
              <button type="button" className="btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {currentUser ? (
        <ReviewForm listingId={listing._id} onSubmitted={loadListing} />
      ) : (
        <div className="review-section text-center">
          <p className="mb-0">
            <Link to="/login">Log in</Link> to leave a review.
          </p>
        </div>
      )}

      <div className="container">
        <ReviewList
          listingId={listing._id}
          reviews={listing.reviews}
          currentUser={currentUser}
          onChanged={loadListing}
        />
      </div>
    </Layout>
  );
}
