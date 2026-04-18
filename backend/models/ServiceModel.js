const mongoose = require("mongoose");

const serviceStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    shortDesc: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    benefits: { type: [String], default: [] },
    steps: { type: [serviceStepSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

const defaultServices = [
  {
    slug: "legal-consultation",
    title: "Legal Consultation",
    icon: "Users",
    shortDesc: "Book one-on-one consultations with experienced advocates for expert guidance on your legal matters.",
    desc: "Get expert legal advice from verified professionals. Our consultation service connects you with experienced advocates who provide personalized guidance for your legal matters, whether it's a simple query or a complex case.",
    benefits: [
      "One-on-one sessions with verified advocates",
      "Available in person, via phone, or video call",
      "Confidential and privileged communication",
      "Receive written opinion and next-step recommendations",
      "Flexible scheduling including weekends",
    ],
    steps: [
      { title: "Describe Your Matter", desc: "Fill in a brief about your legal issue so we can match you with the right expert." },
      { title: "Get Matched", desc: "Our system recommends the best advocates based on your case type and preferences." },
      { title: "Book & Consult", desc: "Choose a time slot, make payment, and meet your advocate for professional counsel." },
    ],
    order: 1,
  },
  {
    slug: "document-creation",
    title: "Document Creation",
    icon: "FileText",
    shortDesc: "Get professionally drafted legal documents, agreements, wills, contracts, and more tailored to your needs.",
    desc: "Professional legal document drafting by qualified lawyers. From contracts and agreements to wills and affidavits, get legally sound documents tailored to your specific needs.",
    benefits: [
      "Drafted by qualified legal professionals",
      "Customized to your specific requirements",
      "Legally compliant and court-ready",
      "Quick turnaround - most documents within 48 hours",
      "Unlimited revisions within 7 days",
    ],
    steps: [
      { title: "Select Document Type", desc: "Choose the type of document you need from our comprehensive catalogue." },
      { title: "Provide Details", desc: "Fill in the required information and any special instructions for your document." },
      { title: "Receive & Review", desc: "Get your professionally drafted document delivered to your dashboard for review." },
    ],
    order: 2,
  },
  {
    slug: "notary",
    title: "Notary Service",
    icon: "Shield",
    shortDesc: "Certified notary services for document authentication, affidavits, and official attestations.",
    desc: "Certified notary services for document authentication, affidavits, oath administration, and official attestations. Our registered notaries ensure your documents carry legal authority.",
    benefits: [
      "Certified and registered notary professionals",
      "Document authentication and attestation",
      "Affidavit preparation and notarization",
      "Available at our offices or at your location",
      "Digital records maintained for future reference",
    ],
    steps: [
      { title: "Submit Your Documents", desc: "Upload or bring the documents that require notarization." },
      { title: "Verification", desc: "Our notary reviews and verifies all documents and identities." },
      { title: "Notarize & Receive", desc: "Documents are notarized, stamped, and returned with official certification." },
    ],
    order: 3,
  },
];

const defaultServicePageFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSfOZHjzucvZ5ID3ClBuO9qXmykTAiPqQDC1X4xn5wiTCLa4CQ/viewform";
const defaultServicePageFormResponseUrl =
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeqDDPAVou8yqhxm7DxUfoSI3aieBp_796WIUe4_3Sm2_MP3Q/formResponse";
const defaultServicePageFormEntryIds = [
  "entry.642944343",
  "entry.1001639118",
  "entry.1940470873",
  "entry.1021924392",
  "entry.104519797",
  "entry.2107636565",
];

function getServicePageFormUrl() {
  return (process.env.SERVICE_PAGE_FORM_URL || defaultServicePageFormUrl).trim();
}

function toFormResponseUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/viewform(?:\?.*)?$/i, "/formResponse");
}

function getServicePageFormResponseUrl() {
  const configured = (process.env.SERVICE_PAGE_FORM_RESPONSE_URL || "").trim();
  if (configured) {
    return configured;
  }

  const fallback = toFormResponseUrl(getServicePageFormUrl());
  return fallback || defaultServicePageFormResponseUrl;
}

function getServicePageFormEntryIds() {
  const configured = (process.env.SERVICE_PAGE_FORM_ENTRY_IDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return configured.length > 0 ? configured : defaultServicePageFormEntryIds;
}

function sanitizeService(service) {
  return {
    id: service._id.toString(),
    slug: service.slug,
    title: service.title,
    icon: service.icon,
    shortDesc: service.shortDesc,
    desc: service.desc,
    benefits: service.benefits,
    steps: service.steps,
    order: service.order,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

async function seedServicesIfEmpty() {
  const count = await Service.countDocuments();
  if (count > 0) {
    return;
  }

  await Service.insertMany(defaultServices);
}

async function getAllServices() {
  await seedServicesIfEmpty();
  const services = await Service.find().sort({ order: 1, createdAt: 1 });
  return services.map(sanitizeService);
}

async function getServiceBySlug(slug) {
  await seedServicesIfEmpty();
  const service = await Service.findOne({ slug: String(slug).trim() });
  if (!service) {
    return { notFound: true };
  }

  return { service: sanitizeService(service) };
}

module.exports = {
  getAllServices,
  getServiceBySlug,
  getServicePageFormUrl,
  getServicePageFormResponseUrl,
  getServicePageFormEntryIds,
};
