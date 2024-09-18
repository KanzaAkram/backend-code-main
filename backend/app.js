const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes"); // Adjust path as necessary
const db = require("./config/db"); // Ensure this imports your database connection module
const userRoutes = require("./routes/userRoutes");
const userRoleRoutes = require("./routes/userRoleRoutes");

app.use(express.json()); // For parsing application/json

// Use route prefixes for consistency
app.use("/api", authRoutes); // Routes related to authentication
app.use("/api/user", userRoutes); // Routes related to users
app.use("/api/user-role", userRoleRoutes);// Routes related to user roles

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
