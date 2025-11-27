// server/controllers/listingController.js
import Listing from "../models/Listing.js";

/**
 * GET /api/listings
 * Query params supported: city, sharing, ac, priceMax, page, limit
 */
export async function listListings(req, res) {
  try {
    const { city, sharing, ac, priceMax, page = 1, limit = 20 } = req.query;

    const query = {};
    if (city) query.city = { $regex: new RegExp(city, "i") };
    if (typeof sharing !== "undefined" && sharing !== "")
      query.sharing = Number(sharing);
    if (typeof ac !== "undefined" && ac !== "") query.ac = ac === "true";
    if (priceMax) query.price = { $lte: Number(priceMax) };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Listing.find(query).skip(skip).limit(Number(limit)).lean(),
      Listing.countDocuments(query),
    ]);

    return res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("listListings ERROR:", err);
    return res.status(500).json({ message: "Could not fetch listings" });
  }
}

export async function getListing(req, res) {
  try {
    const { id } = req.params;
    const item = await Listing.findById(id).lean();
    if (!item) return res.status(404).json({ message: "Listing not found" });
    return res.json({ item });
  } catch (err) {
    console.error("getListing ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createListing(req, res) {
  try {
    const payload = req.body;
    // Basic validation
    if (!payload || !payload.name || !payload.city || !payload.price) {
      return res
        .status(400)
        .json({ message: "name, city and price are required" });
    }
    const listing = new Listing(payload);
    await listing.save();
    return res.status(201).json({ listing });
  } catch (err) {
    console.error("createListing ERROR:", err);
    return res.status(500).json({ message: "Could not create listing" });
  }
}

export async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const updated = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json({ listing: updated });
  } catch (err) {
    console.error("updateListing ERROR:", err);
    return res.status(500).json({ message: "Update failed" });
  }
}

export async function deleteListing(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteListing ERROR:", err);
    return res.status(500).json({ message: "Delete failed" });
  }
}
