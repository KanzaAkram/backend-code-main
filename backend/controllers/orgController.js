const pool = require("../config/db"); // Adjust the path to your database connection file

// Controller to fetch device information
exports.getDevices = (req, res) => {
  // SQL query to select device data along with corresponding locations
  const sql = `
    SELECT 
      d.dname AS device_name,
      l.name AS location,
      d.node_mac AS node_mac,
      d.currentlimit AS current_limit
    FROM 
      devices d
    LEFT JOIN 
      locations l ON d.location_id = l.id
  `;

  pool.query(sql, (error, results) => {
    if (error) {
      console.error("Database query failed: ", error);
      return res
        .status(500)
        .json({ error: "Database query failed", details: error.message });
    }

    // Respond with the results as JSON
    res.status(200).json(results);
  });
};
