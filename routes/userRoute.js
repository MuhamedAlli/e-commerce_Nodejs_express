const userController = require("../controllers/userController");
const userAuthController = require("../controllers/userAuthController");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/signup").post(userAuthController.signupUser);
router.route("/login").post(userAuthController.login);
router.route("/refreshToken").get(userAuthController.userRefreshToken);
router.route("/revokeToken").post(userAuthController.userRevokeToken);

router
  .route("/:id")
  .get(authMiddleware.protect, userController.getUser)
  .patch(authMiddleware.protect, userController.updateUser)
  .delete(authMiddleware.protect, userController.deleteUser);

//dashboard routes - this routes is for the admin dashboard, where admin can see his profile,
router.route("/").get(userController.getPaginatedUsers);

module.exports = router;
