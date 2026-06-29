import { useNavigate } from "react-router-dom";
import { createListing } from "../api/listings";
import Layout from "../components/Layout";
import ListingForm from "../components/ListingForm";
import ProtectedRoute from "../components/ProtectedRoute";

export default function NewListingPage() {
  const navigate = useNavigate();

  async function handleSubmit(formData) {
    const data = await createListing(formData);
    navigate(`/listing/${data.listing._id}`);
  }

  return (
    <ProtectedRoute>
      <Layout>
        <h2 className="form-title text-center mt-4">Create New Stay</h2>
        <ListingForm submitLabel="Publish Listing" onSubmit={handleSubmit} />
      </Layout>
    </ProtectedRoute>
  );
}
