const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error:don't leak error details!
  } else {
    //1) log error
    console.log(err);
    //2) send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};
const handleValidationErrors = (err) => {
  const arrErr = err.details.map((detail) => detail.message);
  return new AppError(arrErr, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (`${error.stack}`.startsWith("ValidationError"))
      error = handleValidationErrors(err);

    sendErrorProd(error, res);
  }
};
