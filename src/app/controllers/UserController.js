const formatter = require('@utils/formatter');
const validation = require('@utils/validation');
const userService = require('@services/userService');
const authService = require('@services/AuthService');

const controller = {};

controller.list = async (req, res) => {
  res.json({});
};

controller.create = async (req, res) => {
  res.json({});
};

controller.item = async (req, res) => {
  const { usersId } = req.params;
  const params = {
    usersId: formatter.toNumber(usersId),
  };
  const valErr = validation.validator(res, params, {
    usersId: validation.check.common.reqInteger,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  const result = await userService.findById(usersId);
  return global.message.ok(res, 'success', result);
};

controller.updateItem = async (req, res) => {
  const { usersId } = req.params;
  const { email, name, phone } = req.body;
  const params = {
    usersId: formatter.toNumber(usersId),
    email,
    name,
    phone,
    imageUrl: req.file.path,
    imageThumbUrl: req.file.path,
  };
  const valErr = validation.validator(res, params, {
    usersId: validation.check.common.reqInteger,
    email: validation.check.common.string,
    name: validation.check.common.string,
    phone: validation.check.common.string,
    imageUrl: validation.check.common.string,
    imageThumbUrl: validation.check.common.string,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  const me = await userService.getLoginUser(req);
  const authState = await authService.getAuthState(req, [1]);
  if (me?.id === usersId || authState?.isAllowed) {
    const result = await userService.update(params);
    return global.message.ok(res, 'success', {
      update: result,
      image: req.file,
    });
  }
  return global.message.forbidden(res, 'not allowed');
};

controller.deleteItem = async (req, res) => {
  res.json({});
};

module.exports = controller;
