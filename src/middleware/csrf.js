const csrf = require('csurf');

module.exports = async (app) => {
  try {
    if (global.config.secret.ALLOWED_CSRF === 'true') {
      const csrfProtection = csrf({ cookie: true });
      app.use(csrfProtection);
    }
  } catch (e) {
    global.logger.devError('🔴 /src/middleware/csrf.js');
    global.logger.devError(e);
  }
};
