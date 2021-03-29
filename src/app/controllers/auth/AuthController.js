const passport = require('passport');
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
  const valError = validation.validator(res, req.body, {
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });
  if (valError) return global.message.badRequest(res, valError.message, valError.data);

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
      return false;
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
  const valError = validation.validator(res, req.body, {
    name: validation.check.auth.name,
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });
  if (valError) return global.message.badRequest(res, valError.message, valError.data);

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
    return global.message.serviceUnavailable(res, 'register failed');
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
controller.getSecretCode = (req, res) => {
  // parameters
  const { email } = req.body;

  // Validation Check
  const valError = validation.validator(res, req.body, {
    email: validation.check.auth.email,
  });
  if (valError) return global.message.badRequest(res, valError.message, valError.data);

  AuthService.findUserByEmail(email)
    .then(user => {
      return global.message.ok(res, 'success', {
        code: `${user.updatedAt.getTime()}`.substring(0, 6),
      });
    })
    .catch(e => {
      return global.message.badRequest(res, 'user not found', e);
    });
};

controller.showResetUserPassword = async (req, res, next) => {
  return res.render('reset_password', {
    email_regex: regex.email,
    password_regex: regex.password,
    email_alert: 'Could not find your account',
    password_alert: 'Please write longer than 6 digits.',
    password_does_not_match_alert: 'Password verification does not match.',
  });
};

controller.resetUserPassword = async (req, res, next) => {
  // Parameters
  const { email, password, code } = req.body;
  const params = {
    email,
    password,
    code,
  };

  // Validation
  const valError = validation.validator(res, params, {
    email: validation.check.common.reqString,
    password: validation.check.common.reqString,
    code: validation.check.common.reqString,
  });
  if (valError) return global.message.badRequest(res, valError.message, valError.data);

  const user = await AuthService.findUserByEmail(params.email);

  if (`${user.updatedAt.getTime()}`.substring(0, 6) !== params.code) {
    return global.message.badRequest(res, 'Not the correct code.');
  }

  // salt and hash
  const { salt, hashPassword } = await AuthService.createSaltAndHash(params.password);

  // Service
  Model.user.update({
    password: hashPassword,
    salt,
  }, {
    where: {
      email: params.email,
    },
  }).then(v => {
    if (v[0]) {
      return global.message.created(res, 'success');
    }
    return global.message.badRequest(res, 'password reset failed', {
      type: 'data not changed',
    });
  }).catch(() => {
    return global.message.badRequest(res, 'password reset failed', {
      type: 'query error',
    });
  });
  return next();
};

module.exports = controller;
