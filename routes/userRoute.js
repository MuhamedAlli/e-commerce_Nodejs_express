const userController = require("../controllers/userController");
const express = require("express");

const router = express.Router();

router.route("/").post(userController.registerUser);

module.exports = router;
