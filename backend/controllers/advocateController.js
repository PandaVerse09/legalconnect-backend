const {
  registerAdvocate,
  getAllAdvocates,
  getAdvocateById,
} = require("../models/AdvocateModel");

async function postAdvocateRegistration(req, res) {
  const result = await registerAdvocate(req.body);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  return res.status(201).json({
    message: "Lawyer registration submitted successfully.",
    advocate: result.lawyer,
  });
}

async function getAdvocates(req, res) {
  const result = await getAllAdvocates();

  return res.json({
    count: result.advocates.length,
    advocates: result.advocates,
  });
}

async function getAdvocate(req, res) {
  const result = await getAdvocateById(req.params.id);

  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  if (result.notFound) {
    return res.status(404).json({ message: "Advocate not found." });
  }

  return res.json({ advocate: result.lawyer });
}

module.exports = {
  postAdvocateRegistration,
  getAdvocates,
  getAdvocate,
};
