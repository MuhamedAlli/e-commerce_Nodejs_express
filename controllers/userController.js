const { User } = require("../models/userModel");
const { userRegisterValidate } = require("../validations/userValidation");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.registerUser = catchAsync(async (req, res, next) => {
  await userRegisterValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  console.log(req.params);
  let user = await User.findByPk(req.params.id);
  if (!user) {
    return next(
      new AppError(`User is not found with ${req.params.id} id`, 404)
    );
  }

  res.status(200).json({ status: "success", data: user });
});
