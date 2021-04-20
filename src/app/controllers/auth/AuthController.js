const passport = require('passport');
const validation = require('@utils/validation');
const authService = require('@services/authService');
const userService = require('@services/userService');
const regex = require('@utils/regex');

require('dotenv').config();

const controller = {};
/*
  Login
 */
controller.viewLogin = async (req, res) => {
  const authInfo = await authService.getAuthState(req);

  if (authInfo?.isLogin) return res.redirect('/');

  return res.render('auth', {
    title: 'Login',
    page: 'login',
  });
};

controller.doLogin = async (req, res) => {
  // System config Parameters
  const { period, redirectUrl } = await authService.initialParamsForLogin();

  // Validation Check
  const valErr = validation.validator(res, req.body, {
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

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

      // login
      return authService.login(req, res, {
        payload,
        period,
        redirectUrl,
        message: data.message,
      });
    },
  )(req, res, redirectUrl, period);
  return false;
};

/*
  Register
 */
controller.viewRegister = async (req, res) => {
  const authInfo = await authService.getAuthState(req);
  if (authInfo?.isLogin) {
    res.redirect('/');
  }
  res.render('auth', {
    title: 'Register',
    page: 'register',
  });
};

controller.doRegister = async (req, res) => {
  // Parameters
  const { name, email, password } = req.body;
  const { period, redirectUrl } = await authService.initialParamsForLogin();

  // Validation Check
  const valErr = validation.validator(res, req.body, {
    name: validation.check.auth.name,
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  // create user
  const createUser = await userService.create({
    name,
    email,
    password,
  });
  if (createUser?.error) return global.message.badRequest(res, createUser?.message);

  // login
  if (!createUser?.error) {
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
    return false;
  }
  return global.message.serviceUnavailable(res, 'register failed');
};

/*
  Logout
 */
controller.doLogout = async (req, res) => {
  const authInfo = await authService.getAuthState(req);
  if (authInfo?.isLogin) {
    res.clearCookie('jwt');
    return res.redirect('/');
  }
  return res.send('Not Logged In');
};

/*
  Find or Reset Authentication Information
 */
controller.getResetCode = (req, res) => {
  // parameters
  const { email } = req.body;

  // Validation Check
  const valErr = validation.validator(res, req.body, {
    email: validation.check.auth.email,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  return userService.getResetCodeByEmail(email)
    .then(code => {
      if (!code) return global.message.badRequest(res, 'code not created');
      return global.menubar.ok(res, 'success', {
        code,
      });
    })
    .catch(e => {
      return global.message.badRequest(res, 'error occurred', e);
    });
};

controller.showResetUserPassword = async (req, res) => {
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
  const valErr = validation.validator(res, params, {
    email: validation.check.common.reqString,
    password: validation.check.common.reqString,
    code: validation.check.common.reqString,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  const result = await userService.resetPassword(params);

  if (!result?.error) {
    return global.message.ok(res, result?.message);
  }
  return global.message.badRequest(res, result?.message);
};

module.exports = controller;
