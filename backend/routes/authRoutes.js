const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post(
  "/resend-verification-email",
  authController.resendVerificationEmail
);
router.post("/verify-email", authController.verifyEmail);

module.exports = router;
