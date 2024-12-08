const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const AppError = require("./utils/appError");
const { sequelize } = require("./models");
const app = express();
const cookieParser = require("cookie-parser");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shitting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());

//Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admins", adminRouter);

//handle not founded routes middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't finde ${req.originalUrl} on this server.`, 404));
});

//global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
