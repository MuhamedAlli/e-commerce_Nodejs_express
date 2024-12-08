const permissionController = require("../controllers/permissionController");
const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/adminAuth");
const { canAccess } = require("../middlewares/canAccess");

//adminAuth middleware just applied on the routes below
router.use(adminAuth);
router
  .route("/")
  .post(
    canAccess("create-permission-permission"),
    permissionController.createPermission
  )
  .get(
    canAccess("view-permission-permission"),
    permissionController.getAllPermissions
  );

router
  .route("/:id")
  .post(
    canAccess("update-permission-permission"),
    permissionController.updatePermission
  )
  .get(
    canAccess("view-permission-permission"),
    permissionController.getPermission
  )
  .delete(
    canAccess("delete-permission-permission"),
    permissionController.deletePermission
  );

module.exports = router;
