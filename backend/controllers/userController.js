const db = require("../config/db");

// Controller function to get a user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  // SQL query to fetch user info along with user type and organization
  const query = `
    SELECT 
      u.username AS full_name,
      u.email,
      ut.type_name AS user_type,
      GROUP_CONCAT(l.name SEPARATOR ', ') AS organization
    FROM users u
    JOIN user_types ut ON u.user_type_id = ut.id
    LEFT JOIN location_users lu ON u.id = lu.user_id
    LEFT JOIN locations l ON lu.location_id = l.id
    WHERE u.id = ?
    GROUP BY u.id;
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database query error", details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data
    res.json(result[0]);
  });
};
