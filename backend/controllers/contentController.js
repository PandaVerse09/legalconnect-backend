const {
  getAllServices,
  getServiceBySlug,
  getServicePageFormResponseUrl,
  getServicePageFormEntryIds,
} = require("../models/ServiceModel");
const { getAllTestimonials } = require("../models/TestimonialModel");

async function getServices(req, res) {
  const services = await getAllServices();
  return res.json({
    count: services.length,
    services,
  });
}

async function getService(req, res) {
  const result = await getServiceBySlug(req.params.slug);
  if (result.notFound) {
    return res.status(404).json({ message: "Service not found." });
  }

  return res.json({
    service: result.service,
  });
}

async function getTestimonials(req, res) {
  const testimonials = await getAllTestimonials();
  return res.json({
    count: testimonials.length,
    testimonials,
  });
}

async function submitServiceForm(req, res) {
  const entryIds = getServicePageFormEntryIds();
  const source =
    req.body && typeof req.body.entries === "object" && req.body.entries
      ? req.body.entries
      : req.body;

  const values = entryIds.map((entryId) => {
    const value = source?.[entryId];
    return typeof value === "string" ? value.trim() : "";
  });

  const missingEntryIds = entryIds.filter((entryId, index) => !values[index]);
  if (missingEntryIds.length > 0) {
    return res.status(400).json({
      message: "Missing required Google Form fields.",
      missingEntryIds,
      expectedEntryIds: entryIds,
    });
  }

  const payload = new URLSearchParams();
  entryIds.forEach((entryId, index) => {
    payload.append(entryId, values[index]);
  });

  const response = await fetch(getServicePageFormResponseUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: payload.toString(),
    redirect: "manual",
  });

  if (response.status >= 400) {
    return res.status(502).json({
      message: "Google Form submission failed.",
      googleStatus: response.status,
    });
  }

  return res.status(201).json({
    message: "Form submitted successfully.",
    forwardedTo: getServicePageFormResponseUrl(),
    googleStatus: response.status,
  });
}

async function submitContactForm(req, res) {
  const entryIds = getServicePageFormEntryIds();
  const source =
    req.body && typeof req.body.entries === "object" && req.body.entries
      ? req.body.entries
      : req.body;

  const values = entryIds.map((entryId) => {
    const value = source?.[entryId];
    return typeof value === "string" ? value.trim() : "";
  });

  const missingEntryIds = entryIds.filter((entryId, index) => !values[index]);
  if (missingEntryIds.length > 0) {
    return res.status(400).json({
      message: "Missing required Google Form fields.",
      missingEntryIds,
      expectedEntryIds: entryIds,
    });
  }

  const payload = new URLSearchParams();
  entryIds.forEach((entryId, index) => {
    payload.append(entryId, values[index]);
  });

  const response = await fetch(getServicePageFormResponseUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: payload.toString(),
    redirect: "manual",
  });

  if (response.status >= 400) {
    return res.status(502).json({
      message: "Google Form submission failed.",
      googleStatus: response.status,
    });
  }

  return res.status(201).json({
    message: "Contact form submitted successfully.",
    forwardedTo: getServicePageFormResponseUrl(),
    googleStatus: response.status,
  });
}

module.exports = {
  getServices,
  getService,
  getTestimonials,
  submitServiceForm,
  submitContactForm,
};
