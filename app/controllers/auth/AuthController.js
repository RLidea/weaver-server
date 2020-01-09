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

const doLogin = (req, res, next) => {
  CommonCodeModel.findAll({
    where: { group_codes_id: 1 },
  }).then(r => {
    console.log(r);
  });
  const redirectUrl = '/';
  const period = 3;

  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err || !user) {
      return res.status(400).json({
        success: false,
        message,
        err,
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
    });
  })(req, res, redirectUrl, period);
};

const viewRegister = (req, res, next) => {
  if (isAuthorized(req, res, next)) {
    res.redirect('/');
  }
  res.render('auth', { title: 'Register', page: 'register', csrfToken: req.csrfToken() });
};

const doRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  const salt = Math.round(new Date().valueOf() * Math.random()) + '';
  const hashPassword = crypto
    .createHash('sha512')
    .update(password + salt)
    .digest('hex');

  UserModel.create({
    authorities_id: 1,
    name,
    email,
    password: hashPassword,
    salt,
  })
    .then(r => {
      console.log(r.dataValues);
      res.redirect('/auth/login');
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
