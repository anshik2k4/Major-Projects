import { useEffect, useState } from "react";
import { fetchFormOptions } from "../api/listings";
import { useToast } from "../context/ToastContext";

const EMPTY_VALUES = {
  title: "",
  description: "",
  price: "",
  location: "",
  country: "",
  category: "city",
};

export default function ListingForm({
  initialValues = EMPTY_VALUES,
  existingImageUrl = "",
  submitLabel,
  onSubmit,
}) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setValues({ ...EMPTY_VALUES, ...initialValues });
  }, [initialValues]);

  useEffect(() => {
    fetchFormOptions()
      .then((data) => setCategoryOptions(data.categoryOptions || []))
      .catch(() => setCategoryOptions([]));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!values.title.trim() || !values.description.trim() || !values.price ||
        !values.location.trim() || !values.country.trim()) {
      toast.warning("All fields are required.");
      setError("All fields are required.");
      return;
    }

    if (!existingImageUrl && !imageFile) {
      toast.warning("Please upload an image.");
      setError("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("description", values.description.trim());
    formData.append("price", values.price);
    formData.append("location", values.location.trim());
    formData.append("country", values.country.trim());
    formData.append("category", values.category);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="unique-form-container shadow-lg">
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            className="unique-input form-control mb-3"
            name="title"
            placeholder="🏠 Listing Title"
            value={values.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="unique-input unique-textarea form-control mb-3"
            name="description"
            placeholder="✍️ Description of your stay..."
            value={values.description}
            onChange={handleChange}
            required
          />

          <label className="form-label">
            {existingImageUrl ? "Update Image (optional)" : "Listing Image"}
          </label>
          {existingImageUrl && (
            <img
              src={existingImageUrl}
              alt="Current listing"
              className="d-block mb-2 rounded"
              style={{ maxHeight: 180, objectFit: "cover" }}
            />
          )}
          <input
            type="file"
            className="unique-input form-control mb-3"
            name="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="number"
                className="unique-input form-control"
                name="price"
                placeholder="💰 Price"
                value={values.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="unique-input form-control"
                name="country"
                placeholder="🌍 Country"
                value={values.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <input
            type="text"
            className="unique-input form-control mb-3"
            name="location"
            placeholder="📍 Location"
            value={values.location}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="category-select">
            Stay type
          </label>
          <select
            className="unique-input form-control mb-3"
            name="category"
            id="category-select"
            value={values.category}
            onChange={handleChange}
            required
            style={{ width: "90%" }}
          >
            {categoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {error && <p className="text-danger small text-center">{error}</p>}

          <div className="row justify-content-center mt-4">
            <div className="col-5 col-md-4 col-lg-3">
              <button
                type="submit"
                className="btn btn-outline-danger w-100 py-3"
                disabled={submitting}
              >
                {submitting ? "Saving…" : submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
