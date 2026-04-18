const express = require("express");
const bookingController = require("../controllers/bookingController");
const { requireAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/api/bookings", bookingController.postBooking);
router.get("/api/bookings", requireAdmin, bookingController.getBookings);

module.exports = router;
