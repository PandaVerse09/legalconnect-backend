const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/api/auth/login", authController.getLoginInfo);
router.post("/api/auth/login", authController.postLogin);
router.post("/api/auth/logout", authController.postLogout);

router.get("/login", authController.getLoginInfo);
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/sign-in", authController.postSignIn);

router.post("/log-in", authController.postLogIn);

router.post("/sign-out", authController.postLogout);

router.post("/log-out", authController.postLogout);

module.exports = router;
