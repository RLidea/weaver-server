const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const Model = require('./../../models');
const UserModel = Model.user;
const CommonCodeModel = Model.common_code;

require('dotenv').config();

const viewLogin = (req, res, next) => {
  if (isAuthorized(req, res, next)) {
    return res.redirect('/');
  }
  res.render('auth', { title: 'Login', page: 'login', csrfToken: req.csrfToken() });
};

const doLogin = async (req, res, next) => {
  const auth_period = await CommonCodeModel.findOne({
    where: { name: 'auth_period' },
  }).then(r => r.dataValues.data);

  const redirect_uri_after_login = await CommonCodeModel.findOne({
    where: { name: 'redirect_uri_after_login' },
  }).then(r => r.dataValues.data);

  const redirectUrl = `${redirect_uri_after_login}`;
  const period = auth_period | 0;

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
      const newDate = new Date();
      const expDate = newDate.setMonth(newDate.getMonth() + (period | 0));
      res.cookie('jwt', token, { sameSite: true, maxAge: expDate });
      res.redirect(redirectUrl);
    });
  })(req, res, redirectUrl, period);
};

const viewRegister = (req, res, next) => {
  if (isAuthorized(req, res, next)) {
    res.redirect('/');
  }
  res.render('auth', { title: 'Register', page: 'register', csrfToken: req.csrfToken() });
};

const doRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  const default_authorities = await CommonCodeModel.findOne({
    where: { name: 'default_authorities' },
  }).then(r => r.dataValues.data);

  const redirect_uri_after_register = await CommonCodeModel.findOne({
    where: { name: 'redirect_uri_after_register' },
  }).then(r => r.dataValues.data);

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

const doLogout = (req, res, next) => {
  if (isAuthorized(req, res, next)) {
    res.clearCookie('jwt');
    return res.redirect('/');
  } else {
    return res.send('Not Logged In');
  }
};

const createToken = payload => {
  return jwt.sign({ ...payload, access: 'authenticated' }, process.env.JWT_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '5m',
    issuer: process.env.APP_NAME,
  });
};

const isAuthorized = (req, res, next) => {
  const token = req.cookies['jwt'];
  const sign = process.env.JWT_SECRET_KEY;

  return jwt.verify(token, sign, function(err, decoded) {
    if (err || !decoded) {
      console.log('invalid token');
      return false;
    } else if (decoded && (!decoded.access || decoded.access == 'unauthenticated')) {
      console.log('unauthenticated token');
      return false;
    } else if (decoded && decoded.access == 'authenticated') {
      console.log('valid token');
      return true;
    } else {
      console.log('something suspicious');
      return false;
    }
  });
};

module.exports = Object.assign(
  {},
  {
    viewLogin,
    doLogin,
    viewRegister,
    doRegister,
    doLogout,
    isAuthorized,
    createToken,
  },
);
