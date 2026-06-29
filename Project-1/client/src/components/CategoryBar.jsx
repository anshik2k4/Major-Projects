import { Link, useSearchParams } from "react-router-dom";

export default function CategoryBar({ items, selectedCategory }) {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.trim() || "";

  function buildHref(item) {
    const params = new URLSearchParams();
    if (item.id) params.set("category", item.id);
    if (q) params.set("q", q);
    const query = params.toString();
    return query ? `/?${query}` : "/";
  }

  return (
    <nav className="category-strip" aria-label="Browse by stay type">
      <div className="category-strip-inner">
        {items.map((item) => {
          const active =
            (item.id === null && !selectedCategory) ||
            (item.id && item.id === selectedCategory);

          return (
            <Link
              key={item.label}
              to={buildHref(item)}
              className={`category-pill ${active ? "category-pill--active" : ""}`}
            >
              <span className="category-pill__icon" aria-hidden="true">
                <i className={item.icon} />
              </span>
              <span className="category-pill__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
