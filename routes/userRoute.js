const userController = require("../controllers/userController");
const authController = require("../controllers/userAuthController");
const express = require("express");

const router = express.Router();

router.route("/signup").post(authController.signupUser);
router.route("/login").post(authController.login);

router.route("/").get(userController.getPaginatedUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
