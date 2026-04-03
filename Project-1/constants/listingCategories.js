/** Allowed listing category slugs (DB + query param). */
const LISTING_CATEGORIES = [
  "beach",
  "mountain",
  "city",
  "countryside",
  "lake",
  "camping",
  "luxury",
];

/** UI: icon is Font Awesome class without "fa-" prefix sometimes — we use full fa-* in EJS */
const CATEGORY_BAR_ITEMS = [
  { id: null, label: "All", icon: "fa-solid fa-border-all" },
  { id: "beach", label: "Beach", icon: "fa-solid fa-umbrella-beach" },
  { id: "mountain", label: "Mountains", icon: "fa-solid fa-mountain" },
  { id: "city", label: "City", icon: "fa-solid fa-city" },
  { id: "countryside", label: "Countryside", icon: "fa-solid fa-tree" },
  { id: "lake", label: "Lake", icon: "fa-solid fa-water" },
  { id: "camping", label: "Camping", icon: "fa-solid fa-campground" },
  { id: "luxury", label: "Luxury", icon: "fa-solid fa-gem" },
];

function isValidCategory(value) {
  return typeof value === "string" && LISTING_CATEGORIES.includes(value);
}

module.exports = {
  LISTING_CATEGORIES,
  CATEGORY_BAR_ITEMS,
  isValidCategory,
};
