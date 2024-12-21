const { Product } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { ProductImage } = require("../models");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/iamges/products");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ dest: "public/iamges/products" });

exports.uploadProductImage = upload.single("thumbnail");

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: newProduct,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new AppError(`Product is not found with ${req.params.id} id`, 404)
    );
  }

  let updateProduct = await product.update(req.body);
  res.status(200).json({ status: "success", data: updateProduct });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(
      new AppError(`Product is not found with ${req.params.id} id`, 404)
    );
  }

  await product.destroy();

  res.status(204).json({ status: "success" });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findByPk(req.params.id);
  if (!product) {
    return next(
      new AppError(`Product is not found with ${req.params.id} id`, 404)
    );
  }
  res.status(200).json({ status: "success", data: product });
});

exports.getPaginatedProducts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; //rows will be skiped
  const { rows: products, count } = await Product.findAndCountAll({
    limit,
    offset,
  });
  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
    totalCount: count,
    perPage: limit,
    currentPage: page,
  });
});
