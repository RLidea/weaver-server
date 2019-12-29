const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

const viewLogin = (req, res, next) => {
  if (isAuthorized(req)) {
    res.send('Already Logged In');
  } else {
    res.sendfile(path.join(__dirname, '/../../../public/login.html'));
  }
};

const doLogin = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      // return res.status(400).json({
      //   message: 'Login Failed',
      // });
      return next(err);
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
      const expDate = newDate.setMonth(newDate.getMonth() + 3);
      res.cookie('jwt', token, { sameSite: true, maxAge: expDate });
      res.send({ success: true });
      // return res.json({ success: 'true', token });
    });
  })(req, res);
};

const createToken = payload => {
  return jwt.sign({ ...payload }, process.env.JWT_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '5m',
    issuer: process.env.APP_NAME,
  });
};

const isAuthorized = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
      console.log(err, decoded);
      return true;
    });
  } catch (e) {
    return false;
  }
};

const authenticateRouter = (req, res, next) => {
  const token = req.cookies.jwt;
  const sign = process.env.JWT_SECRET_KEY;

  jwt.verify(token, sign, function(err, decoded) {
    if (err || !decoded) {
      console.log('invalid token');
      res.send(403);
    } else if (decoded && (!decoded.access || decoded.access == 'unauthenticated')) {
      console.log('unauthenticated token');
      res.send(403);
    } else if (decoded && decoded.access == 'authenticated') {
      console.log('valid token');
      next();
    } else {
      console.log('something suspicious');
      res.send(403);
    }
  });
};

module.exports = Object.assign(
  {},
  {
    viewLogin,
    doLogin,
    isAuthorized,
    createToken,
    authenticateRouter,
  },
);
