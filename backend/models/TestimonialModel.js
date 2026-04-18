const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Testimonial =
  mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);

const defaultTestimonials = [
  {
    name: "Meera Krishnan",
    role: "Business Owner",
    content:
      "Legal Connect made finding a corporate lawyer incredibly simple. Within 48 hours, I had expert counsel reviewing my partnership agreements. The platform saved me weeks of searching.",
    rating: 5,
    order: 1,
  },
  {
    name: "Rohit Agarwal",
    role: "Software Engineer",
    content:
      "I needed urgent help with a property dispute. The advocate I found through Legal Connect was thorough, responsive, and resolved my case efficiently. Highly recommended.",
    rating: 5,
    order: 2,
  },
  {
    name: "Fatima Sheikh",
    role: "Startup Founder",
    content:
      "The document creation service is outstanding. Professional-quality legal documents delivered promptly. Legal Connect has become our go-to platform for all legal needs.",
    rating: 4,
    order: 3,
  },
];

function sanitizeTestimonial(item) {
  return {
    id: item._id.toString(),
    name: item.name,
    role: item.role,
    content: item.content,
    rating: item.rating,
    order: item.order,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

async function seedTestimonialsIfEmpty() {
  const count = await Testimonial.countDocuments();
  if (count > 0) {
    return;
  }

  await Testimonial.insertMany(defaultTestimonials);
}

async function getAllTestimonials() {
  await seedTestimonialsIfEmpty();
  const testimonials = await Testimonial.find().sort({ order: 1, createdAt: 1 });
  return testimonials.map(sanitizeTestimonial);
}

module.exports = {
  getAllTestimonials,
};
