const { userSignupValidate } = require("../validations/userValidation");
const { User } = require("../models");
const { RefreshToken } = require("../models");
const catchAsync = require("../utils/catchAsync");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const { correctPassword } = require("../utils/tokenUtils");
const AppError = require("../utils/appError");
const setRefreshToken = require("../utils/setRefreshTokenInCookie");

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({
    where: { email },
    include: [{ model: RefreshToken, as: "refreshTokens" }],
  });

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  let refreshToken;
  let refreshTokenExpiresIn;
  const token = generateAccessToken(user.id);

  if (user.refreshTokens.some((token) => token.isActive)) {
    const refreshTokenEntity = user.refreshTokens.find(
      (token) => token.isActive
    );
    console.log(refreshTokenEntity.token);
    refreshToken = refreshTokenEntity.token;
    refreshTokenExpiresIn = refreshTokenEntity.expiresAt;
  } else {
    refreshToken = generateRefreshToken();
    refreshTokenExpiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await RefreshToken.create({
      token: refreshToken,
      expiresAt: refreshTokenExpiresIn,
      userId: user.id,
    });
  }

  if (refreshToken) {
    setRefreshToken(res, refreshToken, refreshTokenExpiresIn);
  }

  res.status(200).json({
    status: "success",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
    refreshTokenExpiresIn,
  });
});

exports.signupUser = catchAsync(async (req, res, next) => {
  await userSignupValidate.validateAsync(req.body, {
    abortEarly: false,
  });

  const newUser = await User.create(req.body);
  const token = generateAccessToken(newUser.id);
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    token: refreshToken,
    expiresAt: refreshTokenExpiresIn,
    userId: newUser.id,
  });

  setRefreshToken(res, refreshToken, refreshTokenExpiresIn);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});
