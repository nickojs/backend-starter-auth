const { validationResult } = require('express-validator');
const ErrorHandler = require('../models/http-error');

module.exports = {
  default: (req, res, next) => {
    const errors = validationResult(req);
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    if (!errors.isEmpty()) return next(new ErrorHandler(message, 422));
    next();
  },
  image: (req, res, next) => {
    if (!req.file) {
      return next(new ErrorHandler('No image provided', 422));
    }
    next();
  }
};
