const Joi = require("joi");
const { User } = require("../models/userModel");
const { validateUniqueField } = require("./validateUniqueField");

const userRegisterValidate = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string()
    .email()
    .required()
    .external(validateUniqueField(User, "email")),
  phone: Joi.string().external(validateUniqueField(User, "phone")),
  password: Joi.string().min(8).required(),
  address: Joi.string(),
});

module.exports = {
  userRegisterValidate,
};
