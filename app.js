const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const roleRouter = require("./routes/roleRoute");
const permissionRouter = require("./routes/PermissionRoute");
const categoryRouter = require("./routes/categoryRoute");
const productRouter = require("./routes/productRoute");
const AppError = require("./utils/appError");
const { sequelize } = require("./models");
const app = express();
const cookieParser = require("cookie-parser");
const { seedDatabase } = require("./seeders/intialSeed"); // Import the seed script
const helmet = require("helmet");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shitting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//this function seeds the permissions and superAdmin role and admin to manage our app
// seedDatabase().then(() => {
//   console.log("success");
// });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());

//rate limiter middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));

//Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
//handle not founded routes middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't finde ${req.originalUrl} on this server.`, 404));
});

//global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
