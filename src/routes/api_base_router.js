import express from "express";
import * as categories_controller from "../controllers/categories_controller.js";
import * as marketplace_reviews_controller from "../controllers/marketplace_reviews_controller.js";
import * as social_media_boost_controller from "../controllers/social_media_boost_controller.js";
import * as contact_controller from "../controllers/contact_controller.js";
const router = express.Router();

// Private routes || /api/v1/items/categories
router.post("/items/categories", categories_controller.create)
router.get("/items/categories", categories_controller.show)
router.get("/items/categories/:id", categories_controller.single)
router.put("/items/categories/:id", categories_controller.update)
router.delete("/items/categories/:id", categories_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/product
router.post("/marketplace-reviews/items/product", marketplace_reviews_controller.create)
router.get("/marketplace-reviews/items/product", marketplace_reviews_controller.show)
router.get("/marketplace-reviews/items/product/:id", marketplace_reviews_controller.single)
router.put("/marketplace-reviews/items/product/:id", marketplace_reviews_controller.update)
router.delete("/marketplace-reviews/items/product/:id", marketplace_reviews_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/product
router.post("/social-media-boost/items/product", social_media_boost_controller.create)
router.get("/social-media-boost/items/product", social_media_boost_controller.show)
router.get("/social-media-boost/items/product/:id", social_media_boost_controller.single)
router.put("/social-media-boost/items/product/:id", social_media_boost_controller.update)
router.delete("/social-media-boost/items/product/:id", social_media_boost_controller.destroy)

// Private routes || /api/v1/contact-from
router.post("/contact-from", contact_controller.create)
router.get("/contact-from", contact_controller.show)
router.get("/contact-from/:id", contact_controller.single)
router.put("/contact-from/:id", contact_controller.update)
router.delete("/contact-from/:id", contact_controller.destroy)



export default router;