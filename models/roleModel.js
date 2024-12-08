"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.Admin, { as: "admins", foreignKey: "roleId" });

      Role.belongsToMany(models.Permission, {
        through: models.RolePermission, // Join table
        foreignKey: "roleId", // Foreign key on the RolePermission table
        otherKey: "permissionId", // Foreign key on the RolePermission table for permissions
        targetKey: "id", // The target key for the Permission model
        as: "permissions", // Alias for the related records
        onDelete: "CASCADE", // When a role is deleted, delete the related permissions
        onUpdate: "CASCADE", // When a role is updated, update the roleId in the RolePermission table
      });
    }
  }

  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
    }
  );

  return Role;
};
