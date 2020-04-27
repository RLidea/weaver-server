const Model = require('@models');

const CommonCodeModel = Model.common_code;

// Auth Period
module.exports.authPeriod = async () => {
  return CommonCodeModel.findOne({
    where: { name: 'auth_period' },
  }).then((r) => r.dataValues.data);
};

// Default Authority when user joined
module.exports.defaultAuthorities = async () => {
  return CommonCodeModel.findOne({
    where: { name: 'default_authorities' },
  }).then((r) => r.dataValues.data);
};

// Redirect URI After Login
module.exports.redirectUriAfterLogin = async () => {
  return CommonCodeModel.findOne({
    where: { name: 'redirect_uri_after_login' },
  }).then((r) => r.dataValues.data);
};

// Redirect URI After Register
module.exports.redirectUriAfterRegister = async () => {
  return CommonCodeModel.findOne({
    where: { name: 'redirect_uri_after_register' },
  }).then((r) => r.dataValues.data);
};
