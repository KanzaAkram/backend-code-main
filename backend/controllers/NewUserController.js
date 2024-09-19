const db = require("../config/db"); // Keeps your existing db configuration
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.addUser = async (req, res) => {
  const { username, email, password, userType } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Use promise-based query by calling db.promise().query()
    const result = await db
      .promise()
      .query(
        "INSERT INTO users (username, email, password, user_type_id) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, userType]
      );

    // Send response
    res
      .status(201)
      .json({ message: "User added successfully", userId: result[0].insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
