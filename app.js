const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/appError");

const app = express();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shitting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(x);

  next();
});

app.use("/api/v1/users", userRouter);

//handle not founded routes middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't finde ${req.originalUrl} on this server.`, 404));
});

//global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
