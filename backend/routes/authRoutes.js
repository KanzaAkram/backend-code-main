const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Signup route
router.post("/signup", authController.signup);

// Login route
router.post("/login", authController.login);

// Resend verification email route
router.post("/resend-verification", authController.resendVerificationEmail);

module.exports = router;
