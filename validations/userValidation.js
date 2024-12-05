const Joi = require("joi");
const { User } = require("../models/userModel");
const { validateUniqueField } = require("./validateUniqueField");

const userSignupValidate = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string()
    .email()
    .required()
    .external(validateUniqueField(User, "email")),
  phone: Joi.string().external(validateUniqueField(User, "phone")),
  password: Joi.string().min(8).required(),
  address: Joi.string(),
});

const userUpdateValidate = Joi.object({
  name: Joi.string().min(5),
  email: Joi.string().email().external(validateUniqueField(User, "email")),
  phone: Joi.string().external(validateUniqueField(User, "phone")),
  password: Joi.string().min(8),
  address: Joi.string(),
}).or("name", "email", "phone", "password", "address");

module.exports = {
  userSignupValidate,
  userUpdateValidate,
};
