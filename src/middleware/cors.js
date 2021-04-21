const corsConfig = {
  development: [
    process.env.CLIENT_DOMAIN,
  ],
  test: [
    process.env.CLIENT_DOMAIN,
  ],
  production: [
    process.env.CLIENT_DOMAIN,
  ],
};

module.exports = async (app) => {
  try {
    app.use((req, res, next) => {
      const allowedOrigins = corsConfig[process.env.NODE_ENV];

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
