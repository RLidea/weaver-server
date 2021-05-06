const authService = require('@services/authService');

module.exports = async (app) => {
  try {
    app.use(async (req, res, next) => {
      // not require jwt verification url list
      const allowedUrlPatterns = [
        /^\/$/i,
        /^\/robots.txt(.*)$/i,
        /^\/session(.*)$/i,
        /^\/session\/[0-9a-z]*(.*)$/i,
        /^\/expired(.*)$/i,
        /^\/mail(.*)$/i,
        /\/auth(.*)*$/i,
        /\/csrf$/i,
      ];

      for (let i = 0, l = allowedUrlPatterns.length; i < l; i += 1) {
        if (allowedUrlPatterns[i].exec(req.path) !== null) return next();
      }

      const loginState = authService.getLoginState(req);
      if (!loginState.isLogin) {
        return global.message.unauthorized(res, 'access denied');
      }
      next();
      return false;
    });
  } catch (e) {
    global.logger.devError('🔴 /src/middleware/allowedUrl.js');
    global.logger.devError(e);
  }
};
