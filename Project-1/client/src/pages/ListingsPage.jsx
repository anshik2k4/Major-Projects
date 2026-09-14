import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchListings, searchStaysWithAi } from "../api/listings";
import Layout from "../components/Layout";
import CategoryBar from "../components/CategoryBar";
import ListingCard from "../components/ListingCard";
import AiStayMatcher from "../components/AiStayMatcher";

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
  const aiQuery = searchParams.get("ai")?.trim() || "";

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = aiQuery
          ? await searchStaysWithAi(aiQuery)
          : await fetchListings({ category, q });
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(
            err.message ||
              (aiQuery
                ? "AI search failed. Check GEMINI_API_KEY and try again."
                : "Could not load listings. Is the server running?")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [category, q, aiQuery]);

  function handleSearch(nextQ) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (nextQ) params.set("q", nextQ);
    const query = params.toString();
    navigate(query ? `/?${query}` : "/");
  }

  function handleAiSearch(nextAi) {
    if (!nextAi) {
      navigate("/");
      return;
    }
    const params = new URLSearchParams();
    params.set("ai", nextAi);
    navigate(`/?${params.toString()}`);
  }

  const selectedCategory = data?.selectedCategory ?? null;
  const hasSearch = !!q;
  const hasAiSearch = !!aiQuery;
  let pageTitle = "All listings";
  if (hasAiSearch) {
    pageTitle = "AI-matched stays";
  } else if (hasSearch) {
    pageTitle = "Search results";
  } else if (selectedCategory && PAGE_TITLES[selectedCategory]) {
    pageTitle = PAGE_TITLES[selectedCategory];
  }

  const listings = data?.listings ?? [];
  const matchReasons = data?.matchReasons || {};
  const filters = data?.filters;

  return (
    <Layout searchQuery={hasAiSearch ? "" : q} onSearch={handleSearch}>
      <AiStayMatcher
        query={aiQuery}
        loading={loading && hasAiSearch}
        onSearch={handleAiSearch}
      />

      {data?.categoryBarItems && (
        <CategoryBar
          items={data.categoryBarItems}
          selectedCategory={hasAiSearch ? filters?.category : selectedCategory}
        />
      )}

      <h1 className="list-title">{pageTitle}</h1>
      {hasAiSearch && data?.filters && (
        <div className="ai-matcher-results">
          <p className="ai-matcher-results__summary">{data.filters.summary}</p>
          <div className="ai-matcher-results__chips">
            {filters.category && (
              <span className="ai-filter-chip">{filters.category}</span>
            )}
            {filters.location && (
              <span className="ai-filter-chip">{filters.location}</span>
            )}
            {filters.country && (
              <span className="ai-filter-chip">{filters.country}</span>
            )}
            {filters.maxPrice != null && (
              <span className="ai-filter-chip">
                up to ₹{Number(filters.maxPrice).toLocaleString("en-IN")}
              </span>
            )}
            {filters.minPrice != null && (
              <span className="ai-filter-chip">
                from ₹{Number(filters.minPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {data.relaxed && (
            <p className="ai-matcher-results__note">
              Few exact matches — showing the closest stays we have.
            </p>
          )}
        </div>
      )}
      {hasSearch && !hasAiSearch && (
        <p className="list-search-sub text-muted text-center mb-3">
          Showing results for &ldquo;{q}&rdquo;
        </p>
      )}

      {loading && (
        <p className="text-center text-muted py-5">
          {hasAiSearch ? "Gemini is matching stays…" : "Loading stays…"}
        </p>
      )}

      {error && (
        <p className="text-center text-danger py-5">{error}</p>
      )}

      {!loading && !error && (
        <div className="container px-lg-5 px-md-3 px-2">
          <ul className="row g-3 justify-content-between">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                matchReason={matchReasons[listing._id]}
              />
            ))}
          </ul>

          {listings.length === 0 && (
            <p className="text-center text-muted py-5 mb-0">
              {hasAiSearch
                ? "No stays matched that request. Try a different place, budget, or vibe."
                : hasSearch
                ? "No stays match your search. Try different words or clear the search box."
                : "No stays in this category yet. Try another type or add a new listing."}
            </p>
          )}
        </div>
      )}
    </Layout>
  );
}
