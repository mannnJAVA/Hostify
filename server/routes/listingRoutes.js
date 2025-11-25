// server/routes/listingRoutes.js
import express from "express";
import {
  listListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";

const router = express.Router();

router.get("/", listListings);
router.get("/:id", getListing);

// for now allow create/update/delete (later protect with admin middleware)
router.post("/", createListing);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
