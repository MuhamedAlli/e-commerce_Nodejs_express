"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Admin extends Model {
  static associate(models) {
    Admin.belongsto(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });

    Admin.hasMany(models.RefreshToken, {
      as: "refreshTokens",
    });
  }
}

Admin.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value) {
          const hashedPass = hashText(value);
          this.setDataValue("password", hashedPass);
        }
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Role", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "admins",
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);

module.exports = { Admin };
