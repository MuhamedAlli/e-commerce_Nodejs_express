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
router
  .route("/")
  .post(canAccess("delete-admin-create"), adminController.createAdmin)
  .get(canAccess("delete-admin-view"), adminController.getPaginatedAdmins);

router
  .route("/:id")
  .post(canAccess("delete-admin-update"), adminController.updateAdmin)
  .get(canAccess("delete-admin-view"), adminController.getUser)
  .delete(canAccess("delete-admin-permission"), adminController.deleteAdmin);

module.exports = router;
