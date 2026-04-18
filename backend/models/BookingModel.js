const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    advocateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
      default: null,
    },
    advocateName: {
      type: String,
      default: "",
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      default: "",
      trim: true,
    },
    details: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

function sanitizeBooking(booking) {
  return {
    id: booking._id.toString(),
    serviceType: booking.serviceType,
    advocateId: booking.advocateId ? booking.advocateId.toString() : null,
    advocateName: booking.advocateName,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    details: booking.details,
    status: booking.status,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

function normalizeBookingPayload(payload = {}) {
  const serviceType = String(payload.serviceType || "").trim();
  const clientName = String(payload.clientName || "").trim();
  const clientEmail = String(payload.clientEmail || "").toLowerCase().trim();
  const clientPhone = String(payload.clientPhone || "").trim();
  const details = String(payload.details || "").trim();
  const advocateName = String(payload.advocateName || "").trim();

  if (!serviceType) {
    return { error: "Service type is required." };
  }

  if (!clientName) {
    return { error: "Client name is required." };
  }

  if (!clientEmail || !clientEmail.includes("@")) {
    return { error: "Valid client email is required." };
  }

  const result = {
    serviceType,
    clientName,
    clientEmail,
    clientPhone,
    details,
    advocateName,
  };

  if (payload.advocateId) {
    if (!mongoose.isValidObjectId(payload.advocateId)) {
      return { error: "Invalid advocate id." };
    }
    result.advocateId = payload.advocateId;
  }

  return { data: result };
}

async function createBooking(payload) {
  const normalized = normalizeBookingPayload(payload);
  if (normalized.error) {
    return { error: normalized.error };
  }

  const booking = await Booking.create(normalized.data);
  return { booking: sanitizeBooking(booking) };
}

async function getAllBookings() {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  return bookings.map(sanitizeBooking);
}

module.exports = {
  createBooking,
  getAllBookings,
};
