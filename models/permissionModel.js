"use strict";
const sequelize = require("../config/database");
const { Model, DataTypes } = require("sequelize");

class Permission extends Model {
  static associate(models) {
    Permission.belongsToMany(models.Roles, {
      through: models.RolesPermission,
      foreignKey: "permissionId",
      targetKey: "id",
      as: "roles",
    });
  }
}
Permission.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "permissions",
  }
);

module.exports = { Permission };
