const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const Model = require('./../../models');
const UserModel = Model.user;
const CommonCodeModel = Model.common_code;
const Schema = require('validate');
const regex = require('./../../utils/regex');

require('dotenv').config();

/*
  Login
 */
const viewLogin = async (req, res, next) => {
  const authInfo = await getAuthInfo(req);
  if (authInfo.isLogin) {
    return res.redirect('/');
  }
  res.render('auth', { title: 'Login', page: 'login', csrfToken: req.csrfToken() });
};

const doLogin = async (req, res, next) => {
  // System config Parameters
  const auth_period = await CommonCodeModel.findOne({
    where: { name: 'auth_period' },
  }).then(r => r.dataValues.data);

  const redirect_uri_after_login = await CommonCodeModel.findOne({
    where: { name: 'redirect_uri_after_login' },
  }).then(r => r.dataValues.data);

  const redirectUrl = `${redirect_uri_after_login}`;
  const period = auth_period | 0;

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
    return res.status(400).json({ error: true, message: validationError[0].message });
  }

  // Login
  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err || !user) {
      return res.status(400).json({
        success: false,
        message,
        err,
      });
    }

    const payload = {
      email: user.email,
    };

    req.login(payload, { session: false }, err => {
      if (err) {
        console.error(err);
        res.json(err);
      }
      const token = createToken(payload);
      // const newDate = new Date();
      // const expDate = newDate.setMonth(newDate.getMonth() + (period | 0));
      // const convertedDate = new Date(expDate);

      const expiresIn = 1000 * 60 * 60 * 24 * period; // date

      res.cookie('jwt', token, { sameSite: true, maxAge: expiresIn });
      res.redirect(redirectUrl);
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
  res.render('auth', { title: 'Register', page: 'register', csrfToken: req.csrfToken() });
};

const doRegister = async (req, res, next) => {
  // Parameters
  const { name, email, password } = req.body;

  const default_authorities = await CommonCodeModel.findOne({
    where: { name: 'default_authorities' },
  }).then(r => r.dataValues.data);

  const redirect_uri_after_register = await CommonCodeModel.findOne({
    where: { name: 'redirect_uri_after_register' },
  }).then(r => r.dataValues.data);

  // Validation Check
  const reqBodySchema = new Schema({
    name: {
      type: String,
      required: true,
      length: { min: 1 },
    },
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
    return res.status(400).json({ error: true, message: validationError[0].message });
  }

  // salt and hash
  const salt = Math.round(new Date().valueOf() * Math.random()) + '';
  const hashPassword = crypto
    .createHash('sha512')
    .update(password + salt)
    .digest('hex');
  const authorities_id = (default_authorities | 0) !== 0 ? default_authorities | 0 : 3;

  UserModel.create({
    authorities_id,
    name,
    email,
    password: hashPassword,
    salt,
  })
    .then(r => {
      console.log(r.dataValues);
      res.redirect(redirect_uri_after_register);
    })
    .catch(() => {
      res.redirect('back');
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
  } else {
    return res.send('Not Logged In');
  }
};

/*
  Authentication
 */
const createToken = payload => {
  return jwt.sign({ ...payload, access: 'authenticated' }, process.env.JWT_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '5m',
    issuer: process.env.APP_NAME,
  });
};

const getLoginInfo = req => {
  // Validation
  const token = req.cookies['jwt'];
  const sign = process.env.JWT_SECRET_KEY;

  const objResult = (isLogin, message, decoded = null) => {
    return {
      isLogin,
      message,
      decoded,
    };
  };

  return jwt.verify(token, sign, function(err, decoded) {
    if (err || !decoded) {
      console.log('invalid token');
      return objResult(false, 'invalid token');
    } else if (decoded && (!decoded.access || decoded.access == 'unauthenticated')) {
      console.log('unauthenticated token');
      return objResult(false, 'unauthenticated token');
    } else if (decoded && decoded.access == 'authenticated') {
      console.log('valid token');
      return objResult(true, 'login Succeed', decoded);
    } else {
      console.log('something suspicious');
      return objResult(false, 'something suspicious');
    }
  });
};

const getAuthInfo = async (req, authorities_ids = []) => {
  const loginInfo = getLoginInfo(req);
  const objResult = isAllowed => {
    return {
      isAllowed,
      ...loginInfo,
    };
  };

  // not logged in
  if (!loginInfo.decoded) {
    if (authorities_ids.length !== 0) {
      return objResult(false);
    } else {
      return objResult(true);
    }
  }

  // logged in
  const authorities_id = await UserModel.findOne({
    where: {
      email: loginInfo.decoded.email,
    },
  }).then(user => user.dataValues.authorities_id);

  if (authorities_ids.includes(authorities_id)) {
    return objResult(true);
  } else {
    return objResult(false);
  }
};

const forgotPassword = (req, res, next) => {
  // TODO
  console.log(req.body);
};

module.exports = Object.assign(
  {},
  {
    viewLogin,
    doLogin,
    viewRegister,
    doRegister,
    doLogout,
    getAuthInfo,
    createToken,
    forgotPassword,
  },
);
