const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes"); // Adjust path as necessary
const db = require("./config/db"); // Ensure this imports your database connection module

app.use(express.json()); // For parsing application/json
app.use("/api", authRoutes); // Prefix for your routes

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
