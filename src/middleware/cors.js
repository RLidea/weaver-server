const config = require('@root/src/config');

const corsConfig = {
  development: [
    config.env.CLIENT_DOMAIN,
  ],
  test: [
    config.env.CLIENT_DOMAIN,
  ],
  production: [
    config.env.CLIENT_DOMAIN,
  ],
};

module.exports = async (app) => {
  try {
    app.use((req, res, next) => {
      const allowedOrigins = corsConfig[config.env.NODE_ENV];

      if (allowedOrigins.includes(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      }
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      return next();
    });
  } catch (e) {
    global.logger.devError('🔴 /src/middleware/cors.js');
    global.logger.devError(e);
  }
};
