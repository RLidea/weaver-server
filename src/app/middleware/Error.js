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

  const errors = {
    code: err.status,
    message: err.message,
    detail: {
      url: res.req.url,
      headers: res.req.headers,
    },
  };
  global.logger.error(JSON.stringify(errors));
  global.logger.devError({
    ...errors,
    locals: res.locals,
  });

  // render the error page
  // res.status(err.status || 500);
  // res.render('error', {
  //   title: `::${err.status}`,
  // });

  // send json error
  return res.status(err.status || 500).json({
    errors: {
      code: err.status,
      message: err.message,
      detail: {
        url: res.req.url,
        headers: res.req.headers,
      },
    },
  });
};

module.exports = {

  notFoundError,
  errorMessage,
};
