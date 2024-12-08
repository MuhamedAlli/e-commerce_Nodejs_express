const AppError = require("../utils/appError");

exports.canAccess = (permissionToken) => {
  return async (req, res, next) => {
    if (await req.admin.role.permissions.includes(permissionToken)) return next();
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  };
};
