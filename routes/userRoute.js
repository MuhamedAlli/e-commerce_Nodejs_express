const userController = require("../controllers/userController");
const express = require("express");

const router = express.Router();

router.route("/").post(userController.registerUser);
router.route("/:id").get(userController.getUser);
module.exports = router;
