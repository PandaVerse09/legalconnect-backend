const express = require("express");
const advocateController = require("../controllers/advocateController");

const router = express.Router();

router.get("/api/advocates", advocateController.getAdvocates);
router.post("/api/lawyers/register", advocateController.postAdvocateRegistration);
router.post("/api/advocates/register", advocateController.postAdvocateRegistration);
router.get("/api/advocates/:id", advocateController.getAdvocate);

module.exports = router;
