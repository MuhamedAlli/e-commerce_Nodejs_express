const userController = require("../controllers/userController");
const userAuthController = require("../controllers/userAuthController");
const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { adminAuth } = require("../middlewares/adminAuth");
const { canAccess } = require("../middlewares/canAccess");
const router = express.Router();

router.route("/signup").post(userAuthController.signupUser);
router.route("/login").post(userAuthController.login);
router.route("/forgotPassword").post(userController.forgotPassword);
router.route("/resetPassword/:token").patch(userController.resetPassword);
router.route("/refreshToken").get(userAuthController.userRefreshToken);
router.route("/revokeToken").post(userAuthController.userRevokeToken);
router
  .route("/updateMyPassword")
  .patch(userAuth, userController.updateMyPassword);

router.route("/updateMe").patch(userAuth, userController.updateMe);
router.route("/deleteMe").delete(userAuth, userController.updateMe);

router
  .route("/:id")
  .get(userAuth, userController.getUser)
  .delete(userAuth, userController.deleteUser);

//dashboard routes - this routes are for the admin dashboard, where admin can see his profile,
router
  .route("/")
  .get(
    adminAuth,
    canAccess("view-user-permission"),
    userController.getPaginatedUsers
  );

router.route("/:id").patch(userAuth, userController.updateUser);

module.exports = router;
