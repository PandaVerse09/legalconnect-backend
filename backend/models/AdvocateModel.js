const {
  createLawyer,
  getAllLawyers,
  getLawyerById,
  updateLawyerById,
  deleteLawyerById,
} = require("./LawyerModel");

async function registerAdvocate(payload) {
  return createLawyer(payload, { forceStatus: "pending" });
}

async function getAllAdvocates() {
  const advocates = await getAllLawyers({ status: "approved" });
  return { advocates };
}

async function getAdvocateById(id) {
  return getLawyerById(id);
}

async function updateAdvocateById(id, payload) {
  return updateLawyerById(id, payload);
}

async function deleteAdvocateById(id) {
  return deleteLawyerById(id);
}

module.exports = {
  registerAdvocate,
  getAllAdvocates,
  getAdvocateById,
  updateAdvocateById,
  deleteAdvocateById,
};
