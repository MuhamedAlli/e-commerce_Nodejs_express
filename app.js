const express = require("express");
const morgan = require("morgan");
// require("./config/database");
const userRouter = require("./routes/userRoute");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/users", userRouter);

module.exports = app;
