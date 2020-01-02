const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const UserModel = require('./../../models').user;
require('dotenv').config();

const viewLogin = (req, res, next) => {
  if (isAuthorized(req, res, next)) {
    res.redirect('/');
    // return res.send('Already Logged In');
  }
  res.render('auth', { title: 'Login', page: 'login' });
};

const doLogin = (req, res, next) => {
  const redirectUrl = '/';
  const period = 3;

  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err || !user) {
      return res.status(400).json({
        success: false,
        message: message,
        // message,
      });
      // res.redirect();
      // return next(err);
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
      // res.send({ success: true });
      // return res.json({ success: 'true', token });
    });
  })(req, res, redirectUrl, period);
};

const viewRegister = (req, res, next) => {
  if (isAuthorized(req, res, next)) {
    res.redirect('/');
    // return res.send('Already Logged In');
  }
  res.render('auth', { title: 'Register', page: 'register' });
};

const doRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  const salt = Math.round(new Date().valueOf() * Math.random()) + '';
  const hashPassword = crypto
    .createHash('sha512')
    .update(password + salt)
    .digest('hex');

  console.log(name, email, password, salt, hashPassword);
  UserModel.create({
    authorities_id: 1,
    name,
    email,
    password: hashPassword,
    salt,
  }).then(r => {
    console.log('completed');
    console.log(r);
  });
};

const doLogout = (req, res, next) => {
  if (isAuthorized(req, res, next)) {
    res.clearCookie('jwt');
    return res.redirect('/');

    // res.redirect('/auth/login');
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
    console.log(decoded);
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
