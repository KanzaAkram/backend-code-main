const db = require("../config/db");

// Function to get all user types
const getUserTypes = async (req, res) => {
  try {
    // Fetch user types from the database
    const [rows] = await db.query("SELECT id, type_name FROM user_types");

    // Return user types
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching user types:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getUserTypes };
