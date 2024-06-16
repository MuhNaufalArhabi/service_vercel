const path = require('path');
const err = (err, req, res, next) => {
  console.log(err, path)
  let status = 500;
  let message = "Internal Server Error";

  if (err.name === "NotFound") {
    status = 404;
    message = "Not Found";
  } else if (err.name === "InvalidLogin") {
    status = 400;
    message = "Email or Password wrong";
  } else if (err.name === "InvalidToken" || err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  } else if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    status = 400
    message = err.errors[0].message
  }

  res.status(status).json({message});
};

module.exports = err
