// server/controllers/listingController.js
import Listing from "../models/Listing.js";

/**
 * GET /api/listings
 * supports query params: city, type, priceMin, priceMax, ac, sharing, page, limit
 */
export async function listListings(req, res) {
  try {
    const {
      city,
      type,
      priceMin,
      priceMax,
      ac,
      sharing,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (city) query.city = { $regex: new RegExp(city, "i") };
    if (type) query.type = type;
    if (ac !== undefined) query.ac = ac === "true";
    if (sharing) query.sharing = Number(sharing);
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Listing.find(query).skip(skip).limit(Number(limit)).lean(),
      Listing.countDocuments(query),
    ]);

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error("listListings error", err);
    res.status(500).json({ message: "Server error listing hostels" });
  }
}

export async function getListing(req, res) {
  try {
    const { id } = req.params;
    const item = await Listing.findById(id).lean();
    if (!item) return res.status(404).json({ message: "Listing not found" });
    res.json({ item });
  } catch (err) {
    console.error("getListing error", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Admin: create a listing
// verbose, defensive createListing (temporary debug)
export async function createListing(req, res) {
  try {
    console.log("CREATE LISTING - headers:", req.headers);
    console.log("CREATE LISTING - raw body (req.body):", req.body);

    // If no body arrives, return helpful error instead of crashing
    if (
      !req.body ||
      (Object.keys(req.body).length === 0 && req.body.constructor === Object)
    ) {
      return res.status(400).json({
        message:
          "Empty request body. Ensure you send JSON and include the header Content-Type: application/json",
      });
    }

    const payload = req.body;
    const listing = new Listing(payload);
    await listing.save();

    console.log("CREATE LISTING - saved id:", listing._id);
    return res.status(201).json({ listing });
  } catch (err) {
    console.error(
      "createListing ERROR >>>",
      err && err.stack ? err.stack : err
    );
    const msg = err && err.message ? err.message : "Could not create listing";
    return res.status(500).json({ message: msg });
  }
}

// Admin: update
export async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const updated = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ listing: updated });
  } catch (err) {
    console.error("updateListing error", err);
    res.status(500).json({ message: "Update failed" });
  }
}

// Admin: delete
export async function deleteListing(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteListing error", err);
    res.status(500).json({ message: "Delete failed" });
  }
}
