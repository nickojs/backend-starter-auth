const jwt = require('jsonwebtoken');
const ErroHandler = require('../models/http-error');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token = authHeader.split(' ')[1]; // "Bearer[0] JwtToken[1]"

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
  } catch (error) {
    return next(new ErroHandler('Not authenticated', 401));
  }

  next();
};
