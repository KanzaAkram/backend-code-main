// controllers/deviceController.js
const db = require("../config/db"); // Ensure this points to your database configuration

exports.getDeviceReadings = (req, res) => {
  const deviceName = req.params.deviceName; // Extract the device name from the request parameters

  const query = `
        SELECT d.id, d.dname, 
               r.voltagePhaseR, r.currentPhaseR, 
               r.realPowerPhaseR, r.reactiveEnergyValue, 
               r.apparentEnergyValue, r.powerfactorPhaseR
        FROM devices d
        JOIN readings r ON d.id = r.device_id
        WHERE d.dname = ?`; // Parameterized query to prevent SQL injection

  db.query(query, [deviceName], (err, results) => {
    if (err) {
      // Log the error for debugging
      console.error("Database query error:", err);
      return res.status(500).json({ error: err.message }); // Return server error
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Device not found" }); // Return not found if no results
    }

    res.json(results); // Send the results as the response
  });
};
