const express = require("express");
const { AddNewRoleController } = require("../controllers/roleController");

const router = express.Router();

// POST request to add a new role
router.post("/add-role", AddNewRoleController);

module.exports = router;
