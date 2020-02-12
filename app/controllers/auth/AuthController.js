const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const Model = require('./../../models');
const UserModel = Model.user;
const CommonCodeController = require('./../CommonCodeController');
const UserAuthorityRelationModel = Model.user_authority_relation;
const Schema = require('validate');
const regex = require('./../../utils/regex');
const csrf = require('./../../utils/csrf');

require('dotenv').config();

/*
  Login
 */
const viewLogin = async (req, res, next) => {
  const authInfo = await getAuthInfo(req);

  if (authInfo.isLogin) {
    return res.redirect('/');
  }
  res.render('auth', { title: 'Login', page: 'login', csrfToken: csrf.token(req) });
};

const doLogin = async (req, res, next) => {
  // System config Parameters
  const authPeriod = await CommonCodeController.authPeriod();
  const redirectUriAfterLogin = await CommonCodeController.redirectUriAfterLogin();

  const redirectUrl = `${redirectUriAfterLogin}`;
  const period = authPeriod | 0;

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

      const expiresIn = 1000 * 60 * 60 * 24 * period; // date
      createToken(payload)
        .then(token => {
          res.cookie('jwt', token, { sameSite: true, maxAge: expiresIn });
          res.redirect(redirectUrl);
        })
        .catch(() => {
          res.redirect(redirectUrl);
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
  res.render('auth', { title: 'Register', page: 'register', csrfToken: csrf.token(req) });
};

const doRegister = async (req, res, next) => {
  // Parameters
  const { name, email, password } = req.body;

  const defaultAuthorities = await CommonCodeController.defaultAuthorities();
  const redirectUriAfterRegister = await CommonCodeController.redirectUriAfterRegister();

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
  const authorities_id = (defaultAuthorities | 0) !== 0 ? defaultAuthorities | 0 : 3;

  UserModel.create({
    name,
    email,
    password: hashPassword,
    salt,
  })
    .then(user => {
      console.log(user.dataValues);

      UserAuthorityRelationModel.create({
        users_id: user.dataValues.id,
        authorities_id,
      }).then(r => {
        console.log(r.dataValues);
        res.redirect(redirectUriAfterRegister);
      });
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
const createToken = async payload => {
  const authPeriod = await CommonCodeController.authPeriod();
  return jwt.sign({ ...payload, access: 'authenticated' }, process.env.JWT_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: `${authPeriod}d`,
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
  const users_id = await UserModel.findOne({
    where: {
      email: loginInfo.decoded.email,
    },
  }).then(user => user.dataValues.id);

  const authorities_id = await UserAuthorityRelationModel.findOne({
    where: {
      users_id,
    },
  }).then(auth => auth.dataValues.authorities_id);

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
