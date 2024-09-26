const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes"); // Adjust path as necessary
const db = require("./config/db"); // Ensure this imports your database connection module
const userRoutes = require("./routes/userRoutes");
const userRoleRoutes = require("./routes/userRoleRoutes");
const newUserRoutes = require("./routes/NewUserRoutes");
const userTypeRoutes = require("./routes/UserTypeRoutes");
const roleRoutes = require('./routes/roleRoutes'); // Import the role routes
const orgRoutes = require("./routes/orgRoutes");

app.use(express.json()); // For parsing application/json

// Use route prefixes for consistency
app.use("/api", authRoutes); // Routes related to authentication
app.use("/api/user", userRoutes); // Routes related to users
app.use("/api/user-role", userRoleRoutes); // Routes related to user roles
app.use("/api/users", newUserRoutes); // Routes related to users
app.use("/api/user-types", userTypeRoutes); // Routes related to user types
app.use('/api', roleRoutes); // Register role routes under /api
app.use("/api", orgRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
