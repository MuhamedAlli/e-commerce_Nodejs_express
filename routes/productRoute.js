const productController = require("../controllers/productController");
const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middlewares/adminAuth");
const { canAccess } = require("../middlewares/canAccess");
//adminAuth middleware just applied on the routes below
router.use(adminAuth);
router.post(
  "/",
  canAccess("create-product-permission"),
  productController.uploadProductImage,
  productController.resizeProductImage,
  productController.createProduct
);
router.get(
  "/",
  canAccess("view-product-permission"),
  productController.getPaginatedProducts
);

router.patch(
  "/:id",
  canAccess("update-product-permission"),
  productController.updateProduct
);
router.get(
  "/:id",
  canAccess("view-product-permission"),
  productController.getProduct
);
router.delete(
  "/:id",
  canAccess("delete-product-permission"),
  productController.deleteProduct
);

module.exports = router;
