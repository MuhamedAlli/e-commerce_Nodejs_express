const AppError = require("../utils/appError");

exports.canAccess = (permissionToken) => {
  return async (req, res, next) => {
    let adminPermissions = [];
    if (req.admin.role.permissions) {
      adminPermissions = await req.admin.role.permissions.map(
        (permission) => permission.name
      );
    }

    if (await adminPermissions.includes(permissionToken)) return next();
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  };
};
