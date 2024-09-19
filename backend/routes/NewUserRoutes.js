const express = require("express");
const router = express.Router();
const NewUserController = require("../controllers/NewUserController");

// Define route for adding a new user
router.post("/", NewUserController.addUser);

module.exports = router;
