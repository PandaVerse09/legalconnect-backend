const { createBooking, getAllBookings } = require("../models/BookingModel");

async function postBooking(req, res) {
  const result = await createBooking(req.body);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  return res.status(201).json({
    message: "Booking submitted successfully.",
    booking: result.booking,
  });
}

async function getBookings(req, res) {
  const bookings = await getAllBookings();

  return res.json({
    count: bookings.length,
    bookings,
  });
}

module.exports = {
  postBooking,
  getBookings,
};
