/*
 * Error Handler
 */
const createError = require('http-errors');

const notFoundError = function(req, res, next) {
  next(createError(404));
};

const errorMessage = function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'production' ? { status: err.status } : err;

  console.error('[system] An error has occurred from client');
  console.error(res.locals.error);

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: '::' + err.status,
  });
};

module.exports = Object.assign(
  {},
  {
    notFoundError,
    errorMessage,
  },
);
