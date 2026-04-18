const {
  createLawyer,
  getAllLawyers,
  getLawyerById,
  updateLawyerById,
  deleteLawyerById,
} = require("../models/LawyerModel");

function getAdminDashboard(req, res) {
  return res.json({
    message: "Admin authenticated.",
    admin: req.user.username,
  });
}

async function postLawyer(req, res) {
  const result = await createLawyer(req.body, { forceStatus: "approved" });
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  return res.status(201).json({
    message: "Lawyer form submitted successfully.",
    lawyer: result.lawyer,
  });
}

async function getLawyers(req, res) {
  const lawyers = await getAllLawyers();
  return res.json({
    count: lawyers.length,
    lawyers,
  });
}

async function getLawyer(req, res) {
  const result = await getLawyerById(req.params.id);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  if (result.notFound) {
    return res.status(404).json({ message: "Lawyer not found." });
  }

  return res.json({ lawyer: result.lawyer });
}

async function putLawyer(req, res) {
  const result = await updateLawyerById(req.params.id, req.body);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  if (result.notFound) {
    return res.status(404).json({ message: "Lawyer not found." });
  }

  return res.json({
    message: "Lawyer updated successfully.",
    lawyer: result.lawyer,
  });
}

async function deleteLawyer(req, res) {
  const result = await deleteLawyerById(req.params.id);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  if (result.notFound) {
    return res.status(404).json({ message: "Lawyer not found." });
  }

  return res.json({
    message: "Lawyer deleted successfully.",
    lawyer: result.lawyer,
  });
}

async function patchLawyerStatus(req, res) {
  const { status } = req.body || {};
  const normalizedStatus = String(status || "").trim().toLowerCase();

  if (!["pending", "approved"].includes(normalizedStatus)) {
    return res.status(400).json({ message: "Status must be pending or approved." });
  }

  const result = await updateLawyerById(req.params.id, { status: normalizedStatus });

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  if (result.notFound) {
    return res.status(404).json({ message: "Lawyer not found." });
  }

  return res.json({
    message: "Lawyer status updated successfully.",
    lawyer: result.lawyer,
  });
}

module.exports = {
  getAdminDashboard,
  postLawyer,
  getLawyers,
  getLawyer,
  putLawyer,
  deleteLawyer,
  patchLawyerStatus,
};
