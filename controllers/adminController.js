const { adminCreateValidate } = require("../validations/adminValidation");
const { Admin } = require("../models");
const { RefreshToken } = require("../models");
const catchAsync = require("../utils/catchAsync");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const { correctPassword } = require("../utils/tokenUtils");
const AppError = require("../utils/appError");

exports.createAdmin = catchAsync(async (req, res, next) => {
  await adminCreateValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const newAdmin = await Admin.create(req.body);
  const { password, ...data } = newAdmin.toJSON();
  res.status(201).json({
    status: "success",
    data,
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  await adminCreateValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const admin = await Admin.findByPk(req.params.id);

  if (!admin) {
    return next(
      new AppError(`Admin is not found with ${req.params.id} id`, 404)
    );
  }

  let updateAdmin = await admin.update(req.body);
  const { password, ...rest } = updateAdmin.toJSON();
  res.status(200).json({ status: "success", data: rest });
});

exports.getUser = catchAsync(async (req, res, next) => {
  let admin = await Admin.findByPk(req.params.id);
  if (!admin) {
    return next(
      new AppError(`Admin is not found with ${req.params.id} id`, 404)
    );
  }

  res.status(200).json({ status: "success", data: admin });
});

exports.getPaginatedAdmins = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; //rows will be skiped
  const { rows: admins, count } = await Admin.findAndCountAll({
    limit,
    offset,
  });

  const pageCount = Math.ceil(count / limit);

  res.status(200).json({
    status: "success",
    data: admins,
    totalCount: count,
    pageCount,
    perPage: limit,
    currentPage: page,
  });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByPk(req.params.id);

  if (!admin) {
    return next(
      new AppError(`Admin is not found with ${req.params.id} id`, 404)
    );
  }

  await admin.destroy();

  res.status(204).json({ status: "success" });
});
