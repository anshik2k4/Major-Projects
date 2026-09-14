export async function fetchListings({ category, q } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const query = params.toString();
  const url = query ? `/listing/api?${query}` : "/listing/api";

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to load listings");
  }
  return res.json();
}

export async function searchStaysWithAi(query) {
  const res = await fetch("/listing/api/ai-search", {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "AI search failed");
  }
  return data;
}

export async function fetchListing(id) {
  const res = await fetch(`/listing/api/${id}`, { credentials: "include" });
  if (res.status === 404) {
    throw new Error("Listing Not Found");
  }
  if (!res.ok) {
    throw new Error("Failed to load listing");
  }
  return res.json();
}

export async function fetchFormOptions() {
  const res = await fetch("/listing/api/form-options", { credentials: "include" });
  if (!res.ok) {
    throw new Error("Failed to load form options");
  }
  return res.json();
}

export async function createListing(formData) {
  const res = await fetch("/listing", {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to create listing");
  }
  return data;
}

export async function updateListing(id, formData) {
  const res = await fetch(`/listing/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { Accept: "application/json" },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Failed to update listing");
  }
  return data;
}

export async function deleteListing(id) {
  const res = await fetch(`/listing/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete listing");
  }
  return res.json();
}

export const CATEGORY_LABELS = {
  beach: "Beachside",
  mountain: "Mountains",
  city: "City",
  countryside: "Countryside",
  lake: "Lakeside",
  camping: "Camping",
  luxury: "Luxury",
};

export function getListingImageUrl(listing) {
  if (!listing?.image) return "";
  return typeof listing.image === "object" ? listing.image.url : listing.image;
}
