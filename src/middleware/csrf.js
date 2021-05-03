const csrf = require('csurf');

module.exports = async (app) => {
  try {
    const csrfProtection = csrf({ cookie: true });
    app.use(csrfProtection);
  } catch (e) {
    global.logger.devError('🔴 /src/middleware/csrf.js');
    global.logger.devError(e);
  }
};
