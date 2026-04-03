const mongoose = require("mongoose");

const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const User = require("../model/user.js");

const { CATEGORY_BAR_ITEMS } = require("../constants/listingCategories.js");

// External image URLs: seed data me Cloudinary upload nahi hota.
// Listing UI me listing.image.url direct show hoti hai.
const sampleListings = [
  // ====== BEACH ======
  {
    title: "Goa Beachside Retreat",
    description:
      "Cozy shack-style stay just 2 minutes from the sandy shores of Calangute Beach. Perfect for friends and couples.",
    image: {
      url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      filename: "",
    },
    price: 3200,
    location: "Calangute, Goa",
    country: "India",
    category: "beach",
  },
  {
    title: "Palolem Palm Grove Cottages",
    description:
      "Private wooden cottages under palm trees, with hammocks and sunset views over Palolem Beach.",
    image: {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      filename: "",
    },
    price: 2800,
    location: "Palolem, Goa",
    country: "India",
    category: "beach",
  },
  {
    title: "Kerala Backwater Beach Villa",
    description:
      "Blend of backwaters and Arabian Sea, airy rooms, local seafood and canoe rides at sunset.",
    image: {
      url: "https://images.unsplash.com/photo-1500375591523-4a5b6fe6c365",
      filename: "",
    },
    price: 4500,
    location: "Varkala, Kerala",
    country: "India",
    category: "beach",
  },
  {
    title: "Bali Oceanfront Bungalow",
    description:
      "Rustic-chic bamboo bungalow with infinity pool and direct views of the Indian Ocean.",
    image: {
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
      filename: "",
    },
    price: 7800,
    location: "Uluwatu, Bali",
    country: "Indonesia",
    category: "beach",
  },
  {
    title: "Malibu Sunset Beach House",
    description:
      "Glass-fronted villa right on the sand, perfect for long walks and golden hour photos.",
    image: {
      url: "https://images.unsplash.com/photo-1469796466635-455ede028aca",
      filename: "",
    },
    price: 18500,
    location: "Malibu, California",
    country: "USA",
    category: "beach",
  },

  // ====== MOUNTAIN ======
  {
    title: "Manali Snow View Chalet",
    description:
      "Warm wooden interiors, fireplace and panoramic views of snow-capped peaks.",
    image: {
      url: "https://images.unsplash.com/photo-1519817650390-64a93db511aa",
      filename: "",
    },
    price: 3500,
    location: "Manali, Himachal Pradesh",
    country: "India",
    category: "mountain",
  },
  {
    title: "Himalayan Sunrise Homestay",
    description:
      "Family-run stay with homemade food and balcony views of the first light on the Himalayas.",
    image: {
      url: "https://images.unsplash.com/photo-1511854009-00c80e6b5e38",
      filename: "",
    },
    price: 2600,
    location: "Mukteshwar, Uttarakhand",
    country: "India",
    category: "mountain",
  },
  {
    title: "Swiss Alpine Cabin",
    description:
      "Traditional wooden cabin tucked away in the Swiss Alps, near hiking trails and ski slopes.",
    image: {
      url: "https://images.unsplash.com/photo-1519817650390-64a93db511aa",
      filename: "",
    },
    price: 23500,
    location: "Zermatt",
    country: "Switzerland",
    category: "mountain",
  },
  {
    title: "Rocky Mountain Hideout",
    description:
      "Secluded A-frame cabin surrounded by pines and mountain streams.",
    image: {
      url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      filename: "",
    },
    price: 12000,
    location: "Estes Park, Colorado",
    country: "USA",
    category: "mountain",
  },
  {
    title: "Nepalese Village Lodge",
    description:
      "Simple and soulful lodge on a trekking route with views of the Annapurna range.",
    image: {
      url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      filename: "",
    },
    price: 3800,
    location: "Pokhara",
    country: "Nepal",
    category: "mountain",
  },

  // ====== CITY ======
  {
    title: "Mumbai Skyline Studio",
    description:
      "Compact studio apartment with fast Wi-Fi and a balcony facing the Bandra-Worli Sea Link.",
    image: {
      url: "https://images.unsplash.com/photo-1548013146-72479768bada",
      filename: "",
    },
    price: 4200,
    location: "Bandra, Mumbai",
    country: "India",
    category: "city",
  },
  {
    title: "Delhi Heritage Apartment",
    description:
      "Modern stay close to Old Delhi with quick access to street food and monuments.",
    image: {
      url: "https://images.unsplash.com/photo-1548013146-72479768bada",
      filename: "",
    },
    price: 3500,
    location: "Karol Bagh, New Delhi",
    country: "India",
    category: "city",
  },
  {
    title: "London Brick Loft",
    description:
      "Exposed brick loft with big windows, walking distance from cafes and the Underground.",
    image: {
      url: "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      filename: "",
    },
    price: 21000,
    location: "Shoreditch, London",
    country: "United Kingdom",
    category: "city",
  },
  {
    title: "Tokyo Neon Capsule Suite",
    description:
      "Futuristic yet cozy micro-suite in the heart of Shinjuku’s neon district.",
    image: {
      url: "https://images.unsplash.com/photo-1518300670268-db1c39eee8d8",
      filename: "",
    },
    price: 13000,
    location: "Shinjuku, Tokyo",
    country: "Japan",
    category: "city",
  },
  {
    title: "New York City Loft",
    description:
      "High-ceiling loft with fire escape views and quick access to subway lines.",
    image: {
      url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
      filename: "",
    },
    price: 26000,
    location: "Brooklyn, New York",
    country: "USA",
    category: "city",
  },

  // ====== COUNTRYSIDE ======
  {
    title: "Punjab Farmstay Retreat",
    description:
      "Live on a working farm with mustard fields, tractor rides and homemade lassi.",
    image: {
      url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
      filename: "",
    },
    price: 2500,
    location: "Ludhiana, Punjab",
    country: "India",
    category: "countryside",
  },
  {
    title: "Rajasthan Desert Hut",
    description:
      "Mud-hut style stay with charpai beds, starry skies and camel safaris.",
    image: {
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077",
      filename: "",
    },
    price: 3000,
    location: "Jaisalmer, Rajasthan",
    country: "India",
    category: "countryside",
  },
  {
    title: "Tuscan Olive Grove House",
    description:
      "Stone house surrounded by olive trees and vineyards, perfect for slow holidays.",
    image: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      filename: "",
    },
    price: 24000,
    location: "Tuscany",
    country: "Italy",
    category: "countryside",
  },
  {
    title: "French Countryside Cottage",
    description:
      "Charming cottage with blue shutters, garden seating and fresh croissants nearby.",
    image: {
      url: "https://images.unsplash.com/photo-1430285561322-7808604715df",
      filename: "",
    },
    price: 19000,
    location: "Provence",
    country: "France",
    category: "countryside",
  },
  {
    title: "New Zealand Farm House",
    description:
      "Open fields, sheep around and mountains far away on the horizon.",
    image: {
      url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
      filename: "",
    },
    price: 15500,
    location: "Waikato",
    country: "New Zealand",
    category: "countryside",
  },

  // ====== LAKE ======
  {
    title: "Naini Lake View Room",
    description:
      "Room with balcony directly overlooking Naini Lake, perfect for misty mornings.",
    image: {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      filename: "",
    },
    price: 3200,
    location: "Nainital, Uttarakhand",
    country: "India",
    category: "lake",
  },
  {
    title: "Udaipur Lake Palace Stay",
    description:
      "Regal stay beside Lake Pichola with rooftop dining and city views.",
    image: {
      url: "https://images.unsplash.com/photo-1528744598421-b7b93e12df0b",
      filename: "",
    },
    price: 9500,
    location: "Udaipur, Rajasthan",
    country: "India",
    category: "lake",
  },
  {
    title: "Swiss Lakeside Chalet",
    description:
      "Wooden chalet just steps from a crystal-clear alpine lake.",
    image: {
      url: "https://images.unsplash.com/photo-1519817650390-64a93db511aa",
      filename: "",
    },
    price: 23000,
    location: "Interlaken",
    country: "Switzerland",
    category: "lake",
  },
  {
    title: "Canadian Cabin on the Lake",
    description:
      "Dock, canoe and fireplace - classic lakeside escape in the woods.",
    image: {
      url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
      filename: "",
    },
    price: 17000,
    location: "Ontario",
    country: "Canada",
    category: "lake",
  },
  {
    title: "Norwegian Fjord Cabin",
    description:
      "Minimal cabin pressed between mountains and calm blue fjord waters.",
    image: {
      url: "https://images.unsplash.com/photo-1527489377706-5bf97e608852",
      filename: "",
    },
    price: 22000,
    location: "Gudvangen",
    country: "Norway",
    category: "lake",
  },

  // ====== CAMPING ======
  {
    title: "Rishikesh River Camp",
    description:
      "Tent stay on sandy banks of the Ganga, includes bonfire and rafting options.",
    image: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      filename: "",
    },
    price: 1800,
    location: "Rishikesh, Uttarakhand",
    country: "India",
    category: "camping",
  },
  {
    title: "Spiti Valley Stargaze Camp",
    description:
      "High-altitude camping with crystal clear night skies and rugged landscapes.",
    image: {
      url: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6",
      filename: "",
    },
    price: 2600,
    location: "Kaza, Himachal Pradesh",
    country: "India",
    category: "camping",
  },
  {
    title: "Sahara Desert Camp",
    description:
      "Tented camp amidst dunes with traditional music and sunrise camel rides.",
    image: {
      url: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f8",
      filename: "",
    },
    price: 5200,
    location: "Merzouga",
    country: "Morocco",
    category: "camping",
  },
  {
    title: "Yosemite Forest Campsite",
    description:
      "Simple campsite under tall pines, close to waterfalls and hiking trails.",
    image: {
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      filename: "",
    },
    price: 6100,
    location: "Yosemite, California",
    country: "USA",
    category: "camping",
  },
  {
    title: "Iceland Aurora Dome",
    description:
      "Transparent dome tent in a remote field for watching Northern Lights.",
    image: {
      url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
      filename: "",
    },
    price: 28000,
    location: "Selfoss",
    country: "Iceland",
    category: "camping",
  },

  // ====== LUXURY ======
  {
    title: "Mumbai Sea Link Penthouse",
    description:
      "Glass-walled penthouse with private terrace and butler service.",
    image: {
      url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
      filename: "",
    },
    price: 52000,
    location: "Worli, Mumbai",
    country: "India",
    category: "luxury",
  },
  {
    title: "Dubai Marina Sky Suite",
    description:
      "Ultra-luxury high-rise suite with infinity pool and skyline views.",
    image: {
      url: "https://images.unsplash.com/photo-1512914890250-353c97c9e7e2",
      filename: "",
    },
    price: 78000,
    location: "Dubai Marina",
    country: "UAE",
    category: "luxury",
  },
  {
    title: "Maldives Overwater Villa",
    description:
      "Iconic overwater villa with glass floor panels and direct access to lagoon.",
    image: {
      url: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108a",
      filename: "",
    },
    price: 95000,
    location: "North Male Atoll",
    country: "Maldives",
    category: "luxury",
  },
  {
    title: "Paris Eiffel View Suite",
    description:
      "Romantic suite with balcony facing the Eiffel Tower, breakfast in bed included.",
    image: {
      url: "https://images.unsplash.com/photo-1494797710133-75adf6c1f4a3",
      filename: "",
    },
    price: 68000,
    location: "7th Arrondissement, Paris",
    country: "France",
    category: "luxury",
  },
  {
    title: "Santorini Cliffside Cave Hotel",
    description:
      "Whitewashed cave room with private plunge pool and sunset over the caldera.",
    image: {
      url: "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0",
      filename: "",
    },
    price: 54000,
    location: "Oia, Santorini",
    country: "Greece",
    category: "luxury",
  },
];

async function ensureSeedOwner() {
  // Owner is used in show.ejs (listinginfo.owner.toString()).
  // So we must always create or reuse at least one User.
  let owner = await User.findOne({});
  if (owner) return owner;

  const username = "seeduser";
  const email = "seeduser@example.com";
  const password = "Seed@1234";

  owner = await User.register({ username, email }, password);
  return owner;
}

async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");

  const owner = await ensureSeedOwner();

  // Destructive: clears collections before inserting seed listings.
  await Review.deleteMany({});
  await Listing.deleteMany({});

  const docs = sampleListings.map((x) => ({
    ...x,
    price: Number(x.price),
    owner: owner._id,
  }));

  await Listing.insertMany(docs);

  console.log(`Seed complete. Inserted ${docs.length} listings.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

