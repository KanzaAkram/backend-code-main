const express = require("express");
const router = express.Router();
const { getDeviceReadings } = require("../controllers/deviceController");

// Define the route for getting device readings by device name
router.get("/readings/:deviceName", getDeviceReadings);

module.exports = router;
