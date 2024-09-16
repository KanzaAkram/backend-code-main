const express = require("express");
const router = express.Router();

// Import the user controller
const { getUserById } = require("../controllers/userController");

// Define route for getting user by ID
router.get("/:id", getUserById);

module.exports = router;
