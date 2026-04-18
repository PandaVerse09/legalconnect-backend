const express = require("express");
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../controllers/authController");

const router = express.Router();

router.get("/api/admin", requireAdmin, adminController.getAdminDashboard);
router.get("/api/lawyers", requireAdmin, adminController.getLawyers);
router.post("/api/lawyers", requireAdmin, adminController.postLawyer);
router.get("/api/lawyers/:id", requireAdmin, adminController.getLawyer);
router.put("/api/lawyers/:id", requireAdmin, adminController.putLawyer);
router.patch("/api/lawyers/:id/status", requireAdmin, adminController.patchLawyerStatus);
router.delete("/api/lawyers/:id", requireAdmin, adminController.deleteLawyer);

router.get("/admin", requireAdmin, adminController.getAdminDashboard);
router.get("/admin/lawyers", requireAdmin, adminController.getLawyers);
router.post("/admin/lawyers", requireAdmin, adminController.postLawyer);
router.get("/admin/lawyers/:id", requireAdmin, adminController.getLawyer);
router.put("/admin/lawyers/:id", requireAdmin, adminController.putLawyer);
router.patch("/admin/lawyers/:id/status", requireAdmin, adminController.patchLawyerStatus);
router.delete("/admin/lawyers/:id", requireAdmin, adminController.deleteLawyer);

module.exports = router;
