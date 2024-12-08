const Joi = require("joi");
const { Admin } = require("../models");
const { validateUniqueField } = require("./validateUniqueField");

exports.adminCreateValidate = Joi.object({
  name: Joi.string()
    .min(5)
    .required()
    .external(validateUniqueField(Admin, "name")),
  email: Joi.string()
    .email()
    .required()
    .external(validateUniqueField(Admin, "email")),
  password: Joi.string().min(8).required(),
  roleId: Joi.number().required(),
});
