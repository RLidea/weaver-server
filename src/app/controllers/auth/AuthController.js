/* eslint max-len:0 */
const passport = require('passport');
const validation = require('@utils/validation');
const authService = require('@services/authService');
const userService = require('@services/userService');
const regex = require('@utils/regex');

require('dotenv').config();

/**
 * @swagger
 * definitions:
 *  auth:
 *    type: "object"
 *    properties:
 *      email:
 *        type: "string"
 *      password:
 *        type: "string"
 */
const controller = {};
/*
  Login
 */

/**
 * @swagger
 * /auth/login:
 *   get:
 *     tags:
 *     - "auth"
 *     summary: "Login page"
 *     description: "Open login page view"
 *     produces:
 *     - "text/html; charset=utf-8"
 *     responses:
 *       "200":
 *         description: "Success"
 *       "404":
 *         description: "Page Not Found"
 */
controller.viewLogin = async (req, res) => {
  const authInfo = await authService.getAuthState(req);

  if (authInfo?.isLogin) return res.redirect('/');

  return res.render('auth', {
    title: 'Login',
    page: 'login',
  });
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *     - "auth"
 *     summary: "Login with email and password"
 *     operationId: "doLogin"
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           email:
 *             type: "string"
 *             required: true
 *             example: "dev@weaver.com"
 *             description: "user email"
 *           password:
 *             type: "string"
 *             example: "bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2"
 *             description: "user password"
 *     responses:
 *       "200":
 *         description: "success"
 *       "405":
 *         description: "Invalid input"
 */
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
/**
 * @swagger
 * /auth/register:
 *   get:
 *     tags:
 *     - "auth"
 *     summary: "Register page"
 *     description: "Open register page view"
 *     produces:
 *     - "text/html; charset=utf-8"
 *     responses:
 *       "200":
 *         description: "success"
 *       "400":
 *         description: "not logged in"
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *     - "auth"
 *     summary: "Create new user"
 *     operationId: "doRegister"
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           email:
 *             type: "string"
 *             example: "new-user@weaver.com"
 *             description: "user email"
 *           password:
 *             type: "string"
 *             example: "bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2"
 *             description: "user password"
 *           name:
 *             type: "string"
 *             example: "new user"
 *             description: "user's name"
 *     responses:
 *       "200":
 *         description: "success"
 *       "405":
 *         description: "Invalid input"
 */
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
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *     - "auth"
 *     summary: "logout"
 *     operationId: "doLogout"
 *     consumes:
 *     - "text/html; charset=utf-8"
 *     produces:
 *     - "text/html; charset=utf-8"
 *     responses:
 *       "200":
 *         description: "success"
 */
controller.doLogout = async (req, res) => {
  const authInfo = await authService.getAuthState(req);
  if (authInfo?.isLogin) {
    res.clearCookie('jwt');
    return res.redirect('/');
  }
  return global.message.badRequest(res, 'Not Logged In');
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

/**
 * @swagger
 * /auth/reset/password:
 *   get:
 *     tags:
 *     - "auth"
 *     summary: "reset password page"
 *     description: "Open reset password page view"
 *     produces:
 *     - "text/html; charset=utf-8"
 *     responses:
 *       "200":
 *         description: "Success"
 *       "404":
 *         description: "Page Not Found"
 */
controller.showResetUserPassword = async (req, res) => {
  return res.render('reset_password', {
    email_regex: regex.email,
    password_regex: regex.password,
    email_alert: 'Could not find your account',
    password_alert: 'Please write longer than 6 digits.',
    password_does_not_match_alert: 'Password verification does not match.',
  });
};

/**
 * @swagger
 * /auth/reset/password:
 *   post:
 *     tags:
 *     - "auth"
 *     summary: "reset user password"
 *     operationId: "doResetPassword"
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       required: true
 *       schema:
 *         type: "object"
 *         properties:
 *           email:
 *             type: "string"
 *             required: true
 *             example: "dev@weaver.com"
 *             description: "user email"
 *           password:
 *             type: "string"
 *             required: true
 *             example: "bd2b1aaf7ef4f09be9f52ce2d8d599674d81aa9d6a4421696dc4d93dd0619d682ce56b4d64a9ef097761ced99e0f67265b5f76085e5b0ee7ca4696b2ad6fe2b2"
 *             description: "user password"
 *           code:
 *             type: "string"
 *             required: true
 *             description: ""
 *     responses:
 *       "200":
 *         description: "success"
 *       "405":
 *         description: "Invalid input"
 */
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
