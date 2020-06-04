module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.send({
    error: err.message,
    code: err.code
  });
};
