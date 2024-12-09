const { Admin } = require("../models");
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
  const admin = await Admin.findOne({
    where: { email },
    include: [{ model: RefreshToken, as: "refreshTokens" }],
    attributes: { include: ["id", "name", "email", "password"] },
  });

  if (!admin || !(await correctPassword(password, admin.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  let refreshToken;
  let refreshTokenExpiresIn;
  const token = generateAccessToken(admin.id);

  if (admin.refreshTokens.some((token) => token.isActive)) {
    const refreshTokenEntity = admin.refreshTokens.find(
      (token) => token.isActive
    );

    refreshToken = refreshTokenEntity.token;
    refreshTokenExpiresIn = refreshTokenEntity.expiresAt;
  } else {
    const newRefreshTokenEntity = await generateRefreshToken(null, admin.id);
    refreshToken = newRefreshTokenEntity.token;
    refreshTokenExpiresIn = newRefreshTokenEntity.expiresAt;
  }

  if (refreshToken) {
    setRefreshToken(res, refreshToken, refreshTokenExpiresIn);
  }

  res.status(200).json({
    status: "success",
    data: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
    token,
    refreshTokenExpiresIn,
  });
});

exports.adminRefreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError("Please provide refresh token", 400));
  }

  const admin = await Admin.findOne({
    where: {},
    include: {
      model: RefreshToken,
      as: "refreshTokens",
      where: {
        token: refreshToken,
      },
      required: true,
    },
  });

  if (!admin) {
    return next(new AppError("Invalid token!", 404));
  }

  const refreshTokenEntity = admin.refreshTokens.find(
    (token) => token.token === refreshToken
  );

  if (!refreshTokenEntity || !refreshTokenEntity.isActive) {
    return next(new AppError("Inactive token!", 400));
  }
  await refreshTokenEntity.update({
    revokedAt: new Date(),
  });

  const newRefreshTokenEntity = await generateRefreshToken(null, admin.id);
  const token = generateAccessToken(admin.id);

  setRefreshToken(
    res,
    newRefreshTokenEntity.token,
    newRefreshTokenEntity.expiresAt
  );

  res.status(200).json({
    status: "success",
    token,
    refreshTokenExpiresIn: newRefreshTokenEntity.expiresAt,
  });
});

exports.adminRevokeToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return next(new AppError("Token is required!", 400));
  }

  const admin = await Admin.findOne({
    include: {
      model: RefreshToken,
      as: "refreshTokens",
      where: {
        token: refreshToken,
      },
      required: true,
    },
  });

  if (!admin) {
    return next(new AppError("Invalid token!", 404));
  }

  const refreshTokenEntity = admin.refreshTokens.find(
    (token) => token.token === refreshToken
  );

  if (!refreshTokenEntity || !refreshTokenEntity.isActive) {
    return next(new AppError("Inactive token!", 400));
  }

  await refreshTokenEntity.update({
    revokedAt: new Date(),
  });

  res.status(200).json({
    status: "success",
  });
});
