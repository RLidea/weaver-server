const authService = require('@services/authService');

module.exports = async (app) => {
  try {
    app.use(async (req, res, next) => {
      // not require jwt verification url list
      const allowedUrlPatterns = [
        /^\/$/,
        /^\/docs$/i,
        /^\/api_history$/i,
        /^\/insomnia.json$/i,
        /^\/robots.txt$/i,
        /^\/session$/i,
        /^\/session\/[0-9a-z]*$/i,
        /^\/expired$/i,
        /^\/mail$/i,
        /\/auth\/(\w)*$/i,
      ];

      for (let i = 0, l = allowedUrlPatterns.length; i < l; i += 1) {
        if (allowedUrlPatterns[i].exec(req.path) !== null) return next();
      }

      const loginInfo = authService.getLoginState(req);
      if (!loginInfo.isLogin) {
        return res.status(401).json({ message: 'access denied' });
      }
      next();
      return false;
    });
  } catch (e) {
    global.logger.devError('🔴 /src/loaders/allowedUrl.js');
    global.logger.devError(e);
  }
};
