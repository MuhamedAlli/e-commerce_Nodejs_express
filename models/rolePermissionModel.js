"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class RolePermission extends Model {}
RolePermission.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Role", key: "id" },
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Permission", key: "id" },
    },
  },
  {
    sequelize,
    modelName: "RolePermission",
    tableName: "role_permissions",
  }
);

module.exports = { RolePermission };
