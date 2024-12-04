const { User } = require("../models/userModel");
const { userRegisterValidate } = require("../validations/userValidation");

exports.registerUser = async (req, res) => {
  try {
    const { error } = userRegisterValidate.validate(req.body);

    if (error) {
      console.log(error.details);
      return res.status(400).json({ errors: error.details });
    }

    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed", error: err.message });
  }
};
