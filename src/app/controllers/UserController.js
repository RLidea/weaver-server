const formatter = require('@utils/formatter');
const validation = require('@utils/validation');
const userService = require('@services/userService');

const controller = {};

controller.list = async (req, res, next) => {
  res.json({});
};

controller.create = async (req, res, next) => {
  res.json({});
};

controller.item = async (req, res, next) => {
  const { usersId } = req.params;
  const params = {
    usersId: formatter.toNumber(usersId),
  };
  const valErr = validation.validator(res, params, {
    usersId: validation.check.common.reqInteger,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  const result = await userService.findUserById(usersId);
  return global.message.ok(res, 'success', result);
};

controller.updateItem = async (req, res, next) => {
  const valErr = validation.validator(res, req.body, {
    email: validation.check.common.string,
    name: validation.check.common.string,
    phone: validation.check.common.string,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  // const result = await userService.update({
  //   email: req.body.email,
  //   name: req.body.name,
  //   phone: req.body.phone,
  //   image: req.file,
  // });
  // return global.message.ok(res, 'success', result);
  return global.message.ok(res, 'success', req.file);
};

controller.deleteItem = async (req, res, next) => {
  res.json({});
};

module.exports = controller;
