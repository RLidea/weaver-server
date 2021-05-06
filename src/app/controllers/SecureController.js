const controller = {};

controller.csrf = async (req, res, next) => {
  return global.message.ok(res, 'success', req.csrfToken());
};

module.exports = controller;
