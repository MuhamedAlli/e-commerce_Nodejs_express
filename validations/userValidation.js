const Joi = require("joi");
const { User } = require("../models/userModel");

const validateUniqueEmail = async (value, helpers) => {
  const existingUser = User.findOne({ where: { email: value } });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  return value;
};
const validateUniquePhone = async (value, helpers) => {
  const existingUser = User.findOne({ where: { phone: value } });

  if (existingUser) {
    throw new Error("Phone number already in use");
  }

  return value;
};

const userRegisterValidate = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string()
    .email()
    .required()
    .custom(validateUniqueEmail, "Unique Email Validation"),
  phone: Joi.string().custom(validateUniquePhone, "Unique Phone Validation"),
  password: Joi.string().min(8).required(),
  address: Joi.string(),
});

module.exports = {
  userRegisterValidate,
};
