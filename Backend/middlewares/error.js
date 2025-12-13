const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

   // 🟡 Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message);
    err = {
      statusCode: 200,
      message: message.join(", "), // Combine multiple error messages
    };
  }
  
  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid token. Please try again `;
    err = new ErrorHandler(message, 400);
  }
  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Your session has expired, Try again `;
    err = new ErrorHandler(message, 400);
  }



  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

