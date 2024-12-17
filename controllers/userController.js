const { User } = require("../models");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendEmail } = require("../utils/email");
const { Op } = require("sequelize");
const crypto = require("crypto");
const { RefreshToken } = require("../models");
const setRefreshToken = require("../utils/setRefreshTokenInCookie");
const {
  userUpdateValidate,
  userUpdateMeValidate,
} = require("../validations/userValidation");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

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
  let user = await User.findByPk(req.params.id);
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return next(new AppError("User is not found", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Your password reset token is: \n\n ${resetUrl} \n\n If you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    console.log(err);
    return next(new AppError(err, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
    include: [{ model: RefreshToken, as: "refreshTokens" }],
    attributes: { include: ["id", "name", "email", "password"] },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  let refreshToken;
  let refreshTokenExpiresIn;
  const token = generateAccessToken(user.id);

  if (user.refreshTokens.some((token) => token.isActive)) {
    const refreshTokenEntity = user.refreshTokens.find(
      (token) => token.isActive
    );

    refreshToken = refreshTokenEntity.token;
    refreshTokenExpiresIn = refreshTokenEntity.expiresAt;
  } else {
    const newRefreshTokenEntity = await generateRefreshToken(user.id, null);
    refreshToken = newRefreshTokenEntity.token;
    refreshTokenExpiresIn = newRefreshTokenEntity.expiresAt;
  }

  if (refreshToken) {
    setRefreshToken(res, refreshToken, refreshTokenExpiresIn);
  }
  res.status(200).json({
    status: "success",
    token,
    refreshTokenExpiresIn,
  });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  //get the current user with his old password
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: ["id", "password"],
  });

  //check if the old password is correct

  if (!(await correctPassword(req.body.password, user.password))) {
    return next(new AppError("Your old password is incorrect", 401));
  }

  //update the password
  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //check if user try to update his password
  if (req.body.password) {
    return next(
      new AppError(
        "Please use /updateMyPassword route for password update",
        400
      )
    );
  }

  await userUpdateMeValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const currentUser = await User.findByPk(req.user.id);

  if (!currentUser) {
    return next(new AppError("User is not found", 404));
  }

  currentUser.update(req.body);

  res.status(200).json({
    status: "success",
    data: currentUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const currentUser = await User.findByPk(req.user.id);
  //TODO soft delete using add isActive column in table and set it to false instead of delete
  // if (!currentUser) {
  //   return next(new AppError("User is not found", 404));
  // }

  // await currentUser.destroy();

  res.status(204).json({ status: "success" });
});
