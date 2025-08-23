import express from "express";
import * as users_controller from "../controllers/users_controller.js";
import * as categories_controller from "../controllers/categories_controller.js";
import * as fiverr_review_controller from "../controllers/marketplace_reviews/fiverr_review_controller.js";
import * as upwork_review_controller from "../controllers/marketplace_reviews/upwork_review_controller.js";
import * as kwork_review_controller from "../controllers/marketplace_reviews/kwork_review_controller.js";
import * as google_review_controller from "../controllers/marketplace_reviews/google_review_controller.js";
import * as fetchers_review_controller from "../controllers/marketplace_reviews/fetchers_review_controller.js";
import * as people_per_review_controller from "../controllers/marketplace_reviews/people_per_review_controller.js";
import * as facebook_boost_controller from "../controllers/social_media_boost/facebook_boost_controller.js";
import * as youtube_boost_controller from "../controllers/social_media_boost/youtube_boost_controller.js";
import * as google_ads_boost_controller from "../controllers/social_media_boost/google_ads_controller.js";
import * as marketplace_reviews_checkout_controller from "../controllers/marketplace_reviews/marketplace_checkout_controller.js";
import * as social_media_boost_checkout_controller from "../controllers/social_media_boost/social_media_checkout_controller.js";
import * as contact_controller from "../controllers/contact_controller.js";
import upload from "../multer/multer.js";
const router = express.Router();

// Private routes || /api/v1/auth/users
router.post("/auth/users", users_controller.create)
router.get("/auth/users", users_controller.show)
router.get("/auth/users/:id", users_controller.single)
router.put("/auth/users/:id", users_controller.update)
router.delete("/auth/users/:id", users_controller.destroy)

// Private routes || /api/v1/items/categories
router.post("/items/categories", categories_controller.create)
router.get("/items/categories", categories_controller.show)
router.get("/items/categories/:id", categories_controller.single)
router.put("/items/categories/:id", categories_controller.update)
router.delete("/items/categories/:id", categories_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/fiverr
router.post("/marketplace-reviews/fiverr", upload.single("attachment"), fiverr_review_controller.create)
router.get("/marketplace-reviews/fiverr", fiverr_review_controller.show)
router.get("/marketplace-reviews/fiverr/:id", fiverr_review_controller.single)
router.put("/marketplace-reviews/fiverr/:id", upload.single("attachment"), fiverr_review_controller.update)
router.delete("/marketplace-reviews/fiverr/:id", fiverr_review_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/upwork
router.post("/marketplace-reviews/items/upwork", upload.single("attachment"), upwork_review_controller.create)
router.get("/marketplace-reviews/items/upwork", upwork_review_controller.show)
router.get("/marketplace-reviews/items/upwork/:id", upwork_review_controller.single)
router.put("/marketplace-reviews/items/upwork/:id", upload.single("attachment"), upwork_review_controller.update)
router.delete("/marketplace-reviews/items/upwork/:id", upwork_review_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/kwork
router.post("/marketplace-reviews/items/kwork", upload.single("attachment"), kwork_review_controller.create)
router.get("/marketplace-reviews/items/kwork", kwork_review_controller.show)
router.get("/marketplace-reviews/items/kwork/:id", kwork_review_controller.single)
router.put("/marketplace-reviews/items/kwork/:id", upload.single("attachment"), kwork_review_controller.update)
router.delete("/marketplace-reviews/items/kwork/:id", kwork_review_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/google
router.post("/marketplace-reviews/items/google", upload.single("attachment"), google_review_controller.create)
router.get("/marketplace-reviews/items/google", google_review_controller.show)
router.get("/marketplace-reviews/items/google/:id", google_review_controller.single)
router.put("/marketplace-reviews/items/google/:id", upload.single("attachment"), google_review_controller.update)
router.delete("/marketplace-reviews/items/google/:id", google_review_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/people-per
router.post("/marketplace-reviews/items/people-per", upload.single("attachment"), people_per_review_controller.create)
router.get("/marketplace-reviews/items/people-per", people_per_review_controller.show)
router.get("/marketplace-reviews/items/people-per/:id", people_per_review_controller.single)
router.put("/marketplace-reviews/items/people-per/:id", upload.single("attachment"), people_per_review_controller.update)
router.delete("/marketplace-reviews/items/people-per/:id", people_per_review_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/items/fetchers
router.post("/marketplace-reviews/items/fetchers", upload.single("attachment"), fetchers_review_controller.create)
router.get("/marketplace-reviews/items/fetchers", fetchers_review_controller.show)
router.get("/marketplace-reviews/items/fetchers/:id", fetchers_review_controller.single)
router.put("/marketplace-reviews/items/fetchers/:id", upload.single("attachment"), fetchers_review_controller.update)
router.delete("/marketplace-reviews/items/fetchers/:id", fetchers_review_controller.destroy)

// Private routes || /api/v1/social-media-boost/items/facebook
router.post("/social-media-boost/items/facebook", facebook_boost_controller.create)
router.get("/social-media-boost/items/facebook", facebook_boost_controller.show)
router.get("/social-media-boost/items/facebook/:id", facebook_boost_controller.single)
router.put("/social-media-boost/items/facebook/:id", facebook_boost_controller.update)
router.delete("/social-media-boost/items/facebook/:id", facebook_boost_controller.destroy)

// Private routes || /api/v1/social-media-boost/items/youtube
router.post("/social-media-boost/items/youtube", youtube_boost_controller.create)
router.get("/social-media-boost/items/youtube", youtube_boost_controller.show)
router.get("/social-media-boost/items/youtube/:id", youtube_boost_controller.single)
router.put("/social-media-boost/items/youtube/:id", youtube_boost_controller.update)
router.delete("/social-media-boost/items/youtube/:id", youtube_boost_controller.destroy)

// Private routes || /api/v1/social-media-boost/items/google-ads
router.post("/social-media-boost/items/google-ads", google_ads_boost_controller.create)
router.get("/social-media-boost/items/google-ads", google_ads_boost_controller.show)
router.get("/social-media-boost/items/google-ads/:id", google_ads_boost_controller.single)
router.put("/social-media-boost/items/google-ads/:id", google_ads_boost_controller.update)
router.delete("/social-media-boost/items/google-ads/:id", google_ads_boost_controller.destroy)

// Private routes || /api/v1/marketplace-reviews/checkout
router.post("/marketplace-reviews/checkout", marketplace_reviews_checkout_controller.create)
router.get("/marketplace-reviews/checkout", marketplace_reviews_checkout_controller.show)
router.get("/marketplace-reviews/checkout/:id", marketplace_reviews_checkout_controller.single)
router.put("/marketplace-reviews/checkout/:id", marketplace_reviews_checkout_controller.update)
router.delete("/marketplace-reviews/checkout/:id", marketplace_reviews_checkout_controller.destroy)

// Private routes || /api/v1/social-media-boost/checkout
router.post("/social-media-boost/checkout", social_media_boost_checkout_controller.create)
router.get("/social-media-boost/checkout", social_media_boost_checkout_controller.show)
router.get("/social-media-boost/checkout/:id", social_media_boost_checkout_controller.single)
router.put("/social-media-boost/checkout/:id", social_media_boost_checkout_controller.update)
router.delete("/social-media-boost/checkout/:id", social_media_boost_checkout_controller.destroy)

// Private routes || /api/v1/contact-from
router.post("/contact-from", contact_controller.create)
router.get("/contact-from", contact_controller.show)
router.get("/contact-from/:id", contact_controller.single)
router.put("/contact-from/:id", contact_controller.update)
router.delete("/contact-from/:id", contact_controller.destroy)



export default router;