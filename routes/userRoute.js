const userController = require("../controllers/userController");
const userAuthController = require("../controllers/userAuthController");
const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const router = express.Router();

router.route("/signup").post(userAuthController.signupUser);
router.route("/login").post(userAuthController.login);
router.route("/refreshToken").get(userAuthController.userRefreshToken);
router.route("/revokeToken").post(userAuthController.userRevokeToken);

router
  .route("/:id")
  .get(userAuth, userController.getUser)
  .patch(userAuth, userController.updateUser)
  .delete(userAuth, userController.deleteUser);

//dashboard routes - this routes are for the admin dashboard, where admin can see his profile,
router.route("/").get(userController.getPaginatedUsers);

module.exports = router;
