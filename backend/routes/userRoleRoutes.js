const express = require("express");
const router = express.Router();
const { getUserRoleById } = require("../controllers/userRoleController"); // Ensure controller path is correct

// Define the route for getting user role by ID
router.get("/:id", getUserRoleById);

module.exports = router;
