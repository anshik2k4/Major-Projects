const { LISTING_CATEGORIES, isValidCategory } = require("../constants/listingCategories");

const DEFAULT_MODEL = "gemini-2.0-flash";

function getApiKey() {
    return process.env.GEMINI_API_KEY && String(process.env.GEMINI_API_KEY).trim();
}

function parseJsonFromModel(text) {
    if (!text || typeof text !== "string") return null;
    const trimmed = text.trim();
    try {
        return JSON.parse(trimmed);
    } catch {
        const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
        if (fenced) {
            try {
                return JSON.parse(fenced[1].trim());
            } catch {
                return null;
            }
        }
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        if (start >= 0 && end > start) {
            try {
                return JSON.parse(trimmed.slice(start, end + 1));
            } catch {
                return null;
            }
        }
        return null;
    }
}

async function callGemini(prompt) {
    const apiKey = getApiKey();
    if (!apiKey) {
        const err = new Error(
            "AI search is not configured. Add GEMINI_API_KEY to your .env (Google AI Studio)."
        );
        err.status = 503;
        throw err;
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
            },
        }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const message =
            data?.error?.message ||
            "Gemini could not process this search. Try again in a moment.";
        const err = new Error(message);
        err.status = res.status === 429 ? 429 : 502;
        throw err;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = parseJsonFromModel(text);
    if (!parsed) {
        const err = new Error("AI returned an unexpected response. Try rephrasing your search.");
        err.status = 502;
        throw err;
    }
    return parsed;
}

function normalizeFilters(raw) {
    const category =
        raw?.category && isValidCategory(String(raw.category).toLowerCase())
            ? String(raw.category).toLowerCase()
            : null;

    const toNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) && n >= 0 ? n : null;
    };

    let minPrice = toNum(raw?.minPrice);
    let maxPrice = toNum(raw?.maxPrice);
    if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
        [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    const cleanText = (v) => {
        if (v == null) return null;
        const s = String(v).trim();
        return s.length ? s.slice(0, 80) : null;
    };

    const keywords = Array.isArray(raw?.keywords)
        ? raw.keywords
              .map((k) => cleanText(k))
              .filter(Boolean)
              .slice(0, 8)
        : [];

    return {
        category,
        location: cleanText(raw?.location),
        country: cleanText(raw?.country),
        minPrice,
        maxPrice,
        keywords,
        summary:
            cleanText(raw?.summary)?.slice(0, 180) ||
            "Matching stays from your request.",
    };
}

async function extractStayFilters(userQuery) {
    const prompt = `You are StayHub's stay matcher. StayHub is an India-focused stay booking site.
Convert the guest request into JSON only, with this shape:
{
  "category": one of ${JSON.stringify(LISTING_CATEGORIES)} or null,
  "location": city/region string or null,
  "country": country string or null,
  "minPrice": number in INR per night or null,
  "maxPrice": number in INR per night or null,
  "keywords": string[] extra words for title/description (max 6),
  "summary": one short sentence of what the guest wants
}
Rules:
- Prices are Indian Rupees per night.
- If they say budget/cheap, set maxPrice around 3000 unless they gave a number.
- If they say luxury/premium, set category luxury and minPrice around 8000 unless they gave a number.
- Beach/sea/goa/coast -> beach. Hills/himachal/manali -> mountain. Lake/houseboat -> lake. Tent/trek -> camping. Village/farm -> countryside. Metro/apartment -> city.
- Do not invent a specific hotel name.
Guest request: ${JSON.stringify(userQuery)}`;

    const raw = await callGemini(prompt);
    return normalizeFilters(raw);
}

async function rankListings(userQuery, listings) {
    if (!listings.length) return [];

    const compact = listings.slice(0, 40).map((listing) => ({
        id: String(listing._id),
        title: listing.title,
        description: (listing.description || "").slice(0, 180),
        price: listing.price,
        location: listing.location,
        country: listing.country,
        category: listing.category || "city",
    }));

    const prompt = `Rank StayHub listings for this guest request.
Guest: ${JSON.stringify(userQuery)}
Listings: ${JSON.stringify(compact)}
Return JSON:
{ "ranked": [ { "id": "<listing id>", "reason": "short why it matches (max 12 words)" } ] }
Only use ids from the list. Best matches first. Include every listing if possible.`;

    try {
        const raw = await callGemini(prompt);
        const ranked = Array.isArray(raw?.ranked) ? raw.ranked : [];
        return ranked
            .map((item) => ({
                id: String(item.id || item._id || ""),
                reason: String(item.reason || "").slice(0, 80),
            }))
            .filter((item) => item.id);
    } catch {
        return compact.map((item) => ({ id: item.id, reason: "" }));
    }
}

module.exports = {
    getApiKey,
    extractStayFilters,
    rankListings,
};
