import { useNavigate } from "react-router-dom";
import { createListing } from "../api/listings";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";
import ListingForm from "../components/ListingForm";
import ProtectedRoute from "../components/ProtectedRoute";

export default function NewListingPage() {
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(formData) {
    try {
      const data = await createListing(formData);
      toast.success("Stay published successfully!");
      navigate(`/listing/${data.listing._id}`);
    } catch (err) {
      toast.error(err.message || "Failed to create stay.");
      throw err;
    }
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
