const { userSignupValidate } = require("../validations/userValidation");
const { User } = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { generateAccessToken } = require("../utils/tokenUtils");
const { correctPassword } = require("../utils/tokenUtils");
const AppError = require("../utils/appError");

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ where: { email } });

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = generateAccessToken(user.id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.signupUser = catchAsync(async (req, res, next) => {
  await userSignupValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const newUser = await User.create(req.body);
  const token = generateAccessToken(newUser.id);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});
