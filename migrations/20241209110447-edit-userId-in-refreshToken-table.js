"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop NOT NULL constraint explicitly
    await queryInterface.sequelize.query(`
      ALTER TABLE refresh_tokens MODIFY COLUMN userId INT NULL;
    `);

    // Ensure foreign key constraints are set up correctly
    await queryInterface.changeColumn("refresh_tokens", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("refresh_tokens", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
};
