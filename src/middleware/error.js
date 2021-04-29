/*
 * Error Handler
 * Must be behind the router.
 */
const createError = require('http-errors');
const config = require('@root/src/config');

const error = {};
error.notFoundError = (req, res, next) => {
  next(createError(404));
};

error.errorMessage = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = config.env.NODE_ENV === 'production' ? { status: err.status } : err;

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

module.exports = async (app) => {
  try {
    app.use(error?.notFoundError);
    app.use(error?.errorMessage);
  } catch (e) {
    global.logger.devError('🔴 /src/middleware/error.js');
    global.logger.devError(e);
  }
};
