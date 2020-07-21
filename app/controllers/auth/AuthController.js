const passport = require('passport');
const Schema = require('validate');
const Model = require('@models');
const validation = require('@utils/validation');
const CommonCodeController = require('@controllers/CommonCodeController');
const AuthService = require('@services/AuthService');

require('dotenv').config();

/*
  Login
 */
const getCsrfToken = async (req, res, next) => {
  if (req.headers.secret !== process.env.CSRF_SECRET) {
    return res.json({
      error: true,
      token: {},
    });
  }
  return res.json({
    error: false,
    token: req.csrfToken(),
  });
};

const viewLogin = async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);

  if (authInfo.isLogin) {
    return res.redirect('/');
  }

  return res.render('auth', {
    title: 'Login',
    page: 'login',
    csrfToken: req.csrfToken(),
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
        console.log(err);
        return res.json({
          error: true,
          message: message.message,
          data: {
            err,
          }
        });
      }

      const payload = {
        email: user.email,
      };

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
    csrfToken: req.csrfToken(),
  });
};

const doRegister = async (req, res, next) => {
  // Parameters
  const { name, email, password } = req.body;
  const { period, redirectUrl } = await AuthService.initialParamsForLogin();

  const defaultAuthorities = await CommonCodeController.defaultAuthorities();
  // const redirectUriAfterRegister = await CommonCodeController.redirectUriAfterRegister();

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
  Authentication
 */
const forgotPassword = (req, res, next) => {
  // TODO
  console.log(req.body);
};

module.exports = {
  getCsrfToken,
  viewLogin,
  doLogin,
  viewRegister,
  doRegister,
  doLogout,
  forgotPassword,
};
