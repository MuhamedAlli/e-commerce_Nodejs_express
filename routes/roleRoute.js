const roleController = require("../controllers/roleController");
const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/adminAuth");
const { canAccess } = require("../middlewares/canAccess");

//adminAuth middleware just applied on the routes below
router.use(adminAuth);
router
  .route("/")
  .post(canAccess("create-role-permission"), roleController.createRole)
  .get(canAccess("view-role-permission"), roleController.getPaginatedRoles);

router
  .route("/:id")
  .patch(canAccess("update-role-permission"), roleController.updateRole)
  .get(canAccess("view-role-permission"), roleController.getRole)
  .delete(canAccess("delete-role-permission"), roleController.deleteRole);

module.exports = router;
