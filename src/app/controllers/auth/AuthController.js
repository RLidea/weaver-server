const passport = require('passport');
const Schema = require('validate');
const Model = require('@models');
const validation = require('@utils/validation');
const AuthService = require('@services/AuthService');
const regex = require('@utils/regex');

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
    return global.message.badRequest(res, validationError[0].message);
  }

  // Login
  passport.authenticate(
    'local',
    { session: false },
    (err, user, data) => {
      if (err || !user) {
        global.logger.devError('login failed');
        return global.message.unauthorized(
          res,
          data?.message,
          err,
        );
      }

      const payload = {
        email: user.email,
      };

      // update last login
      Model.user.update({
        lastLogin: new Date(),
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
        message: data.message,
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

  // Validation Check
  const reqBodySchema = new Schema({
    name: validation.check.auth.name,
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });

  const validationError = reqBodySchema.validate(req.body);
  if (validationError.length > 0) {
    const message = validationError[0]?.message;
    return global.message.badRequest(res, message);
  }

  const existUser = await Model.user.findOne({
    where: {
      email,
    },
  }).then(d => d.dataValues)
    .catch(() => { /* do nothing */ });

  if (existUser) {
    return global.message.badRequest(res, 'user exist');
  }

  const isUserCreated = await AuthService.createUser({
    name,
    email,
    password,
  });

  if (isUserCreated) {
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
  } else {
    return global.message.badRequest(res, 'failed create user');
  }
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
    return global.message.badRequest(res, 'password reset failed');
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
    return global.message.ok(res, 'success', email);
  }
  return global.message.badRequest(res, 'password reset failed');
};

module.exports = controller;
