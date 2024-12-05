const { Sequelize } = require("sequelize");
let sequelize;
if (!sequelize) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      logging: console.log, // log queries in development
    }
  );
}

sequelize.authenticate().then(() => {
  console.log("Database Connected...");
});

module.exports = sequelize;
