const mongoose = require("mongoose");

const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const User = require("../model/user.js");

const { LISTING_CATEGORIES } = require("../constants/listingCategories.js");
const { data: baseListings } = require("../init/data.js");

async function ensureOwnerAnshik() {
  // `passport-local-mongoose` adds `username` + register().
  let owner = await User.findOne({ username: "Anshik" });
  if (owner) return owner;

  const username = "Anshik";
  const email = "anshik@example.com";
  const password = "Anshik@1234";

  try {
    owner = await User.register({ username, email }, password);
    return owner;
  } catch (err) {
    // In case user already exists with same email, try to find it.
    owner = await User.findOne({ email });
    if (owner) return owner;
    throw err;
  }
}

function buildDocs({ targetCount = 30, ownerId }) {
  const cats = LISTING_CATEGORIES;

  // Convert your init/data.js format into your Listing schema format.
  // init/data.js has: { title, description, image: URL string, price, location, country }
  const normalized = baseListings.map((x) => ({
    title: x.title,
    description: x.description,
    image: { url: x.image, filename: "" },
    price: Number(x.price),
    location: x.location,
    country: x.country,
  }));

  const docs = [];
  for (let i = 0; i < targetCount; i++) {
    const src = normalized[i % normalized.length];
    const cat = cats[i % cats.length];

    // If we need more than the base sample, duplicate with small variations.
    const dupIndex = i - normalized.length;
    const title =
      dupIndex >= 0 ? `${src.title} (Sample ${dupIndex + 1})` : src.title;

    const price =
      dupIndex >= 0 ? Number(src.price) + (i % 5) * 250 : src.price;

    docs.push({
      ...src,
      title,
      price,
      category: cat,
      owner: ownerId,
    });
  }

  return docs;
}

async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");

  const owner = await ensureOwnerAnshik();

  // Clear current fake data (requested).
  await Review.deleteMany({});
  await Listing.deleteMany({});

  const docs = buildDocs({ targetCount: 30, ownerId: owner._id });
  await Listing.insertMany(docs);

  console.log(`Seed complete. Inserted ${docs.length} listings (owner: Anshik).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

