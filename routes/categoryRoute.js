const categoryController = require("../controllers/categoryController");
const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/adminAuth");
const { canAccess } = require("../middlewares/canAccess");

//adminAuth middleware just applied on the routes below
router.use(adminAuth);
router
  .route("/")
  .post(
    canAccess("create-category-permission"),
    categoryController.createCategory
  )
  .get(
    canAccess("view-category-permission"),
    categoryController.getPaginatedCategories
  );

router
  .route("/:id")
  .patch(
    canAccess("update-category-permission"),
    categoryController.updateCategory
  )
  .get(canAccess("view-category-permission"), categoryController.getCategory)
  .delete(
    canAccess("delete-category-permission"),
    categoryController.deleteCategory
  );

router
  .route("/:id/subcategories")
  .get(
    canAccess("view-category-permission"),
    categoryController.getSubCategories
  );

module.exports = router;
