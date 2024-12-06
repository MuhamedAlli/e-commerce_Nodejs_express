const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  });
};

exports.generateRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

exports.correctPassword = async (candidatePassword, userHashedPassword) => {
  return await bcrypt.compare(candidatePassword, userHashedPassword);
};
