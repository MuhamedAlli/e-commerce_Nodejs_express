module.exports = (res, refreshToken, refreshTokenExpiresIn) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
    sameSite: "strict", // Prevent CSRF
    expires: new Date(refreshTokenExpiresIn),
  });
};
