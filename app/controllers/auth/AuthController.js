const passport = require('passport');
const Schema = require('validate');
const Model = require('@models');
const validation = require('@utils/validationHandler');
const AuthService = require('@services/AuthService');
const regex = require('@utils/regexHandler');
const messageHandler = require('@utils/messageHandler');

require('dotenv').config();

/*
  Login
 */
const viewLogin = async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);

  if (authInfo.isLogin) {
    return res.redirect('/');
  }

  return res.render('auth', {
    title: 'Login',
    page: 'login',
  });
};

const doLogin = async (req, res, next) => {
  // System config Parameters
  const { period, redirectUrl } = await AuthService.initialParamsForLogin();

  // Validation Check
  const reqBodySchema = new Schema({
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });

  const validationError = reqBodySchema.validate(req.body);
  if (validationError.length > 0) {
    return res.json({ error: true, message: validationError[0].message });
  }

  // Login
  passport.authenticate(
    'local',
    { session: false },
    (err, user, message) => {
      if (err || !user) {
        messageHandler.devLog(err);
        return res.json({
          error: true,
          message: message?.message,
          data: {
            err,
          },
        });
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
const viewRegister = async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);
  if (authInfo.isLogin) {
    res.redirect('/');
  }
  res.render('auth', {
    title: 'Register',
    page: 'register',
  });
};

const doRegister = async (req, res, next) => {
  // Parameters
  const { name, email, password } = req.body;
  const { period, redirectUrl } = await AuthService.initialParamsForLogin();

  const defaultAuthorities = process.env.DEFAULT_AUTHORITIES_ID;

  // Validation Check
  const reqBodySchema = new Schema({
    name: validation.check.auth.name,
    email: validation.check.auth.email,
    password: validation.check.auth.password,
  });

  const validationError = reqBodySchema.validate(req.body);
  if (validationError.length > 0) {
    return res.json({ error: true, message: validationError[0].message });
  }

  const existUser = await Model.user.findOne({
    where: {
      email,
    },
  }).then(d => d.dataValues)
    .catch(() => { /* do nothing */ });

  if (existUser) {
    return res.json({
      error: true,
      message: 'user_exist',
    });
  }

  // salt and hash
  const { salt, hashPassword } = AuthService.createSaltAndHash(password);
  const authorities_id = (defaultAuthorities || 0) !== 0 ? defaultAuthorities || 0 : 3;

  // Create User
  const user = await Model.user.create({
    name,
    email,
    password: hashPassword,
    salt,
  })
    .then(d => d.dataValues)
    .catch(() => {
      return res.json({
        error: true,
        message: 'fail_to_create_user',
      });
    });

  // Create user-auth relations
  await Model.user_authority_relation.create({
    users_id: user.id,
    authorities_id,
  }).then(() => { /* do nothing */ })
    .catch(() => {
      return res.json({
        error: true,
        message: 'fail_to_create_relations',
      });
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
  await doLogin(reqLogin, res, { payload, period, redirectUrl, message });
};

/*
  Logout
 */
const doLogout = async (req, res, next) => {
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
const showResetUserPassword = async (req, res, next) => {
  return res.render('reset_password', {
    email_regex: regex.email,
    password_regex: regex.password,
    email_alert: 'Could not find your account',
    password_alert: 'Please write longer than 6 digits.',
    password_does_not_match_alert: 'Password verification does not match.',
  });
};

const resetUserPassword = async (req, res) => {
  // Parameters
  const { email, password } = req.body;
  const params = {
    email,
    password,
  };

  // Validation
  validation.validator(res, params, {
    email: validation.check.common.reqString,
    password: validation.check.common.reqString,
  });

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
    return res.json({
      error: false,
      message: 'success',
      data: {
        email,
      },
    });
  }
  return res.json({
    error: true,
    message: 'password_reset_failed',
  });
};

module.exports = {
  viewLogin,
  doLogin,
  viewRegister,
  doRegister,
  doLogout,
  showResetUserPassword,
  resetUserPassword,
};
