/*
 * Error Handler
 */
const createError = require('http-errors');

const handler = {};
handler.notFoundError = (req, res, next) => {
  next(createError(404));
};

handler.errorMessage = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'production' ? { status: err.status } : err;

  const errors = {
    code: err?.status,
    message: err?.message,
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

module.exports = handler;
