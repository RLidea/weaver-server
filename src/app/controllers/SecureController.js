const controller = {};

controller.csrf = async (req, res, next) => {
  if (global.config.secret.CSRF_SECRET === req.headers.secret) {
    return global.message.ok(res, 'success', req.csrfToken());
  }
  return global.message.badRequest(res, 'failed');
};

module.exports = controller;
