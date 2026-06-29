import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchListings } from "../api/listings";
import Layout from "../components/Layout";
import CategoryBar from "../components/CategoryBar";
import ListingCard from "../components/ListingCard";

const PAGE_TITLES = {
  beach: "Beachside stays",
  mountain: "Mountain getaways",
  city: "City stays",
  countryside: "Countryside retreats",
  lake: "Lakeside stays",
  camping: "Camping & outdoors",
  luxury: "Luxury stays",
};

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "";
  const q = searchParams.get("q")?.trim() || "";

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchListings({ category, q });
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError("Could not load listings. Is the server running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category, q]);

  function handleSearch(nextQ) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (nextQ) params.set("q", nextQ);
    const query = params.toString();
    navigate(query ? `/?${query}` : "/");
  }

  const selectedCategory = data?.selectedCategory ?? null;
  const hasSearch = !!q;
  let pageTitle = "All listings";
  if (hasSearch) {
    pageTitle = "Search results";
  } else if (selectedCategory && PAGE_TITLES[selectedCategory]) {
    pageTitle = PAGE_TITLES[selectedCategory];
  }

  const listings = data?.listings ?? [];

  return (
    <Layout searchQuery={q} onSearch={handleSearch}>
      {data?.categoryBarItems && (
        <CategoryBar
          items={data.categoryBarItems}
          selectedCategory={selectedCategory}
        />
      )}

      <h1 className="list-title">{pageTitle}</h1>
      {hasSearch && (
        <p className="list-search-sub text-muted text-center mb-3">
          Showing results for &ldquo;{q}&rdquo;
        </p>
      )}

      {loading && (
        <p className="text-center text-muted py-5">Loading stays…</p>
      )}

      {error && (
        <p className="text-center text-danger py-5">{error}</p>
      )}

      {!loading && !error && (
        <div className="container px-lg-5 px-md-3 px-2">
          <ul className="row g-3 justify-content-between">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </ul>

          {listings.length === 0 && (
            <p className="text-center text-muted py-5 mb-0">
              {hasSearch
                ? "No stays match your search. Try different words or clear the search box."
                : "No stays in this category yet. Try another type or add a new listing."}
            </p>
          )}
        </div>
      )}
    </Layout>
  );
}
