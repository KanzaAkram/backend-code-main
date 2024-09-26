// devices.js
const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/orgController");

// GET route to fetch device information
router.get("/devices", deviceController.getDevices);

module.exports = router;
