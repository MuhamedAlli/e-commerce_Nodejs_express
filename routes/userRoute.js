const userController = require("../controllers/userController");
const userAuthController = require("../controllers/userAuthController");
const express = require("express");

const router = express.Router();

router.route("/signup").post(userAuthController.signupUser);
router.route("/login").post(userAuthController.login);
router.route("/refreshToken").get(userAuthController.userRefreshToken);
router.route("/revokeToken").post(userAuthController.userRevokeToken);

router.route("/").get(userController.getPaginatedUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
