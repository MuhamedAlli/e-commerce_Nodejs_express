"use strict";
const { Model, DataTypes } = require("sequelize");
const { hashText } = require("../utils/bcrypt");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.RefreshToken, {
        as: "refreshTokens",
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      phone: { type: DataTypes.STRING, unique: true, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );

  return User;
};
