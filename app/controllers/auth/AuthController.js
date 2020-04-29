const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const Schema = require('validate');
const axios = require('axios');
const Model = require('@models');
const regex = require('@utils/regex');
const validation = require('@utils/validation');
const CommonCodeController = require('@controllers/CommonCodeController');

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
  const authInfo = await getAuthInfo(req);

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
  const authPeriod = await CommonCodeController.authPeriod();
  const redirectUriAfterLogin = await CommonCodeController.redirectUriAfterLogin();

  const redirectUrl = `${redirectUriAfterLogin}`;
  const period = authPeriod || 0;

  // Validation Check
  const reqBodySchema = new Schema({
    email: {
      type: String,
      required: true,
      match: regex.email,
      length: { min: 5 },
    },
    password: {
      type: String,
      required: true,
      match: regex.password,
    },
  });

  const validationError = reqBodySchema.validate(req.body);
  if (validationError.length > 0) {
    return res.json({ error: true, message: validationError[0].message });
  }

  // Login
  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err || !user) {
      return res.json({
        error: true,
        message,
        err,
      });
    }

    const payload = {
      email: user.email,
    };

    req.login(payload, { session: false }, (loginError) => {
      if (loginError) {
        console.error(loginError);
        res.json(loginError);
      }

      const expiresIn = 1000 * 60 * 60 * 24 * period; // date
      createToken(payload)
        .then(token => {
          // res.cookie('jwt', token, { sameSite: true, maxAge: expiresIn });
          // res.redirect(redirectUrl);
          res.json({
            error: false,
            cookie: {
              name: 'jwt',
              value: token,
              maxAge: expiresIn,
              message,
            },
            redirectUrl,
          });
        })
        .catch(() => {
          // res.redirect(redirectUrl);
          res.json({
            error: true,
            message: 'login_failed',
          });
        });
    });
  })(req, res, redirectUrl, period);
};

/*
  Register
 */
const viewRegister = async (req, res, next) => {
  const authInfo = await getAuthInfo(req);
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
  const salt = `${Math.round(new Date().valueOf() * Math.random())}`;
  const hashPassword = crypto
    .createHash('sha512')
    .update(password + salt)
    .digest('hex');
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

  console.log('#######');
  console.log(user);
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

  await axios
    .post(`${process.env.DOMAIN}:${process.env.PORT}/auth/login`, { email, password })
    .then(r => {
      return res.json(r.data);
    })
    .catch(() => {
      return res.json({
        error: true,
        message: 'fail_to_logged_in',
      });
    });
};

/*
  Logout
 */
const doLogout = async (req, res, next) => {
  const authInfo = await getAuthInfo(req);
  if (authInfo.isLogin) {
    res.clearCookie('jwt');
    return res.redirect('/');
  }
  return res.send('Not Logged In');
};

/*
  Authentication
 */
const createToken = async (payload) => {
  const authPeriod = await CommonCodeController.authPeriod();
  return jwt.sign(
    { ...payload, access: 'authenticated' },
    process.env.JWT_SECRET_KEY,
    {
      algorithm: 'HS256',
      expiresIn: `${authPeriod}d`,
      issuer: process.env.APP_NAME,
    },
  );
};

const getLoginInfo = (req) => {
  // Validation
  const token = req.cookies.jwt;
  console.log(req);
  console.log(req.cookies);
  const sign = process.env.JWT_SECRET_KEY;

  const objResult = (isLogin, message, decoded = null) => {
    return {
      isLogin,
      message,
      decoded,
    };
  };

  return jwt.verify(token, sign, (err, decoded) => {
    if (err || !decoded) {
      console.log('invalid token');
      return objResult(false, 'invalid token');
    }

    if (
      decoded
      && (!decoded.access || decoded.access === 'unauthenticated')
    ) {
      console.log('unauthenticated token');
      return objResult(false, 'unauthenticated token');
    }

    if (decoded && decoded.access === 'authenticated') {
      console.log('valid token');
      return objResult(true, 'login Succeed', decoded);
    }

    console.log('something suspicious');
    return objResult(false, 'something suspicious');
  });
};

const getAuthInfo = async (req, authorities_ids = []) => {
  const loginInfo = getLoginInfo(req);
  const objResult = (isAllowed) => {
    return {
      isAllowed,
      ...loginInfo,
    };
  };

  // not logged in
  if (!loginInfo.decoded) {
    if (authorities_ids.length !== 0) {
      return objResult(false);
    }
    return objResult(true);
  }

  // logged in
  const users_id = await Model.user.findOne({
    where: {
      email: loginInfo.decoded.email,
    },
  }).then((user) => user.dataValues.id);

  const authorities_id = await Model.user_authority_relation.findOne({
    where: {
      users_id,
    },
  }).then((auth) => auth.dataValues.authorities_id);

  if (authorities_ids.includes(authorities_id)) {
    return objResult(true);
  }
  return objResult(false);
};

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
  getAuthInfo,
  createToken,
  forgotPassword,
};
