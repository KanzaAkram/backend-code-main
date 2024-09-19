const express = require("express");
const router = express.Router();
const { getUserTypes } = require("../controllers/UserTypeController");

// Route to get all user types
router.get("/", getUserTypes);

module.exports = router;
