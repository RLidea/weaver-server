const passport = require('passport');
const Schema = require('validate');
const Model = require('@models');
const validation = require('@utils/validation');
const AuthService = require('@services/AuthService');
const ConfigService = require('@services/ConfigService');
const regex = require('@utils/regex');
const messageHandler = require('@system/message');

require('dotenv').config();

const controller = {};
/*
  Login
 */
controller.viewLogin = async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);

  if (authInfo.isLogin) {
    return res.redirect('/');
  }

  return res.render('auth', {
    title: 'Login',
    page: 'login',
  });
};

controller.doLogin = async (req, res, next) => {
  // System config Parameters
  const { period, redirectUrl } = await AuthService.initialParamsForLogin();

  // Validation Check
  const reqBodySchema = new Schema({
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });

  const validationError = reqBodySchema.validate(req.body);
  if (validationError.length > 0) {
    return messageHandler.failed(res, validationError[0].message);
  }

  // Login
  passport.authenticate(
    'local',
    { session: false },
    (err, user, message) => {
      if (err || !user) {
        global.logger.devError('login failed');
        return messageHandler.failed(
          res,
          message?.message,
          err,
        );
      }

      const payload = {
        email: user.email,
      };

      // update last login
      Model.user.update({
        last_login: new Date(),
      }, {
        where: {
          email: payload.email,
        },
      });

      // login
      AuthService.login(req, res, {
        payload,
        period,
        redirectUrl,
        message: message.message,
      });
    },
  )(req, res, redirectUrl, period);
};

/*
  Register
 */
controller.viewRegister = async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);
  if (authInfo.isLogin) {
    res.redirect('/');
  }
  res.render('auth', {
    title: 'Register',
    page: 'register',
  });
};

controller.doRegister = async (req, res, next) => {
  // Parameters
  const { name, email, password } = req.body;
  const { period, redirectUrl } = await AuthService.initialParamsForLogin();

  const defaultAuthorities = (await ConfigService.get('DEFAULT_AUTHORITIES_ID'))?.value;

  // Validation Check
  const reqBodySchema = new Schema({
    name: validation.check.auth.name,
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });

  const validationError = reqBodySchema.validate(req.body);
  if (validationError.length > 0) {
    const message = validationError[0]?.message;
    return messageHandler.failed({
      res,
      message,
    });
  }

  const existUser = await Model.user.findOne({
    where: {
      email,
    },
  }).then(d => d.dataValues)
    .catch(() => { /* do nothing */ });

  if (existUser) {
    return messageHandler.failed(res, 'user exist');
  }

  // salt and hash
  const { salt, hashPassword } = AuthService.createSaltAndHash(password);
  const authoritiesId = (defaultAuthorities || 0) !== 0 ? defaultAuthorities || 0 : 3;

  // Create User
  const user = await Model.user.create({
    name,
    email,
    password: hashPassword,
    salt,
  })
    .then(d => d.dataValues)
    .catch(() => {
      return messageHandler.failed(res, 'fail_to_create_user');
    });

  // Create user-auth relations
  await Model.user_authority_relation.create({
    users_id: user?.id,
    authorities_id: authoritiesId,
  }).then(() => { /* do nothing */ })
    .catch(() => {
      return messageHandler.failed(res, 'fail_to_create_relations');
    });

  // Login
  const reqLogin = {
    body: {
      email,
      password,
    },
    login: req.login,
  };
  const payload = {
    email,
  };
  const message = 'login with register';
  await controller.doLogin(reqLogin, res, { payload, period, redirectUrl, message });
};

/*
  Logout
 */
controller.doLogout = async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);
  if (authInfo.isLogin) {
    res.clearCookie('jwt');
    return res.redirect('/');
  }
  return res.send('Not Logged In');
};

/*
  Find or Reset Authentication Information
 */
controller.showResetUserPassword = async (req, res, next) => {
  return res.render('reset_password', {
    email_regex: regex.email,
    password_regex: regex.password,
    email_alert: 'Could not find your account',
    password_alert: 'Please write longer than 6 digits.',
    password_does_not_match_alert: 'Password verification does not match.',
  });
};

controller.resetUserPassword = async (req, res) => {
  // Parameters
  const { email, password, code } = req.body;
  const params = {
    email,
    password,
    code,
  };

  // Validation
  validation.validator(res, params, {
    email: validation.check.common.reqString,
    password: validation.check.common.reqString,
    code: validation.check.common.reqString,
  });

  if (req.session.instant !== params.code) {
    return messageHandler.failed(res, 'failed');
  }

  // salt and hash
  const { salt, hashPassword } = AuthService.createSaltAndHash(params.password);

  // Service
  const result = await Model.user.update({
    password: hashPassword,
    salt,
  }, {
    where: {
      email: params.email,
    },
  });

  if (result[0]) {
    return messageHandler.success(res, 'success', email);
  }
  return messageHandler.failed(res, 'password_reset_failed');
};

module.exports = controller;
