const adminController = require("../controllers/adminController");
const adminAuthController = require("../controllers/adminAuthController");
const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/adminAuth");
const { canAccess } = require("../middlewares/canAccess");

router.route("/login").post(adminAuthController.login);
router.route("/refreshToken").get(adminAuthController.adminRefreshToken);
router.route("/revokeToken").post(adminAuthController.adminRevokeToken);

//adminAuth middleware just applied on the routes below
router.use(adminAuth);
router.route("/updateMyPassword").patch(adminController.updateMyPassword);

router
  .route("/")
  .post(canAccess("create-admin-permission"), adminController.createAdmin)
  .get(canAccess("view-admin-permission"), adminController.getPaginatedAdmins);

router
  .route("/:id")
  .patch(canAccess("update-admin-permission"), adminController.updateAdmin)
  .get(canAccess("view-admin-permission"), adminController.getUser)
  .delete(canAccess("delete-admin-permission"), adminController.deleteAdmin);

module.exports = router;
