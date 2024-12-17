const { adminCreateValidate } = require("../validations/adminValidation");
const { adminUpdateValidate } = require("../validations/adminValidation");
const { Admin } = require("../models");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { correctPassword } = require("../utils/tokenUtils");

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

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  //get the current user with his old password
  const admin = await Admin.findOne({
    where: { id: req.admin.id },
    attributes: ["id", "password"],
  });

  //check if the old password is correct

  if (!(await correctPassword(req.body.password, admin.password))) {
    return next(new AppError("Your old password is incorrect", 401));
  }

  //update the password
  admin.password = req.body.newPassword;
  await admin.save();

  res.status(200).json({
    status: "success",
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  await adminUpdateValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const admin = await Admin.findByPk(req.params.id);

  if (!admin) {
    return next(
      new AppError(`Admin is not found with ${req.params.id} id`, 404)
    );
  }

  let updateAdmin = await admin.update(req.body);
  res.status(200).json({ status: "success", data: updateAdmin });
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
