"use strict";
const sequelize = require("../config/database");
const { Model, DataTypes } = require("sequelize");

class RefreshToken extends Model {
  static associate(models) {
    RefreshToken.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    RefreshToken.belongsTo(models.Admin, {
      foreignKey: "adminId",
      as: "admin",
    });
  }
}

RefreshToken.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date() > this.expiresAt;
      },
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get() {
        return (
          !this.getDataValue("isExpired") &&
          this.getDataValue("revokedAt") == null
        );
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "User", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Admin", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    modelName: "RefreshToken",
    tableName: "refresh_tokens",
    sequelize,
  }
);

exports = RefreshToken;
