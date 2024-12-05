const { User } = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { userUpdateValidate } = require("../validations/userValidation");

exports.updateUser = catchAsync(async (req, res, next) => {
  await userUpdateValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new AppError(`User is not found with ${req.params.id} id`, 404)
    );
  }

  let updatedUser = await user.update(req.body);
  const { password, ...rest } = updatedUser.toJSON();
  res.status(200).json({ status: "success", data: rest });
});

exports.getUser = catchAsync(async (req, res, next) => {
  let user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    return next(
      new AppError(`User is not found with ${req.params.id} id`, 404)
    );
  }

  res.status(200).json({ status: "success", data: user });
});

exports.getPaginatedUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; //rows will be skiped
  const { rows: users, count } = await User.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ["password"] },
  });

  const pageCount = Math.ceil(count / limit);

  res.status(200).json({
    status: "success",
    data: users,
    totalCount: count,
    pageCount,
    perPage: limit,
    currentPage: page,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new AppError(`User is not found with ${req.params.id} id`, 404)
    );
  }

  await user.destroy();

  res.status(204).json({ status: "success" });
});
