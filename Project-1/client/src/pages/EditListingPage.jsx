import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchListing,
  updateListing,
  getListingImageUrl,
} from "../api/listings";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ListingForm from "../components/ListingForm";
import ProtectedRoute from "../components/ProtectedRoute";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchListing(id);
        if (!cancelled) setListing(data.listing);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setListing(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const ownerId = listing?.owner?._id || listing?.owner;
  const isOwner = user && ownerId && String(user._id) === String(ownerId);

  async function handleSubmit(formData) {
    const data = await updateListing(id, formData);
    navigate(`/listing/${data.listing._id || id}`);
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <p className="text-center text-muted py-5">Loading listing…</p>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !listing) {
    return (
      <ProtectedRoute>
        <Layout>
          <p className="text-center text-danger py-5">{error || "Listing Not Found"}</p>
          <p className="text-center">
            <Link to="/">Back to all listings</Link>
          </p>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!isOwner) {
    return (
      <ProtectedRoute>
        <Layout>
          <p className="text-center text-danger py-5">
            You are not authorized to edit this listing.
          </p>
          <p className="text-center">
            <Link to={`/listing/${id}`}>Back to listing</Link>
          </p>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <h2 className="form-title text-center mt-4">Update Stay</h2>
        <ListingForm
          key={listing._id}
          initialValues={{
            title: listing.title,
            description: listing.description,
            price: String(listing.price),
            location: listing.location,
            country: listing.country,
            category: listing.category || "city",
          }}
          existingImageUrl={getListingImageUrl(listing)}
          submitLabel="Update Listing"
          onSubmit={handleSubmit}
        />
      </Layout>
    </ProtectedRoute>
  );
}
