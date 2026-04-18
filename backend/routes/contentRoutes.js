const express = require("express");
const contentController = require("../controllers/contentController");

const router = express.Router();

router.get("/api/services", contentController.getServices);
router.post("/api/services/form-submit", contentController.submitServiceForm);
router.post("/api/contact/submit", contentController.submitContactForm);
router.get("/api/services/:slug", contentController.getService);
router.get("/api/testimonials", contentController.getTestimonials);

module.exports = router;
