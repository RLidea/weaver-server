const path = require('path');
const jwt = require('jsonwebtoken');
// const { genJwtToken } = require("./jwt-generator");

const viewLogin = (req, res, next) => {
  // console.log('@viewLogin', isAuthorized(req));
  // if (isAuthorized(req)) {
  //   res.send('Already Logged In');
  // } else {
  //   res.sendfile(path.join(__dirname, '/../../../public/login.html'));
  // }
  res.sendfile(path.join(__dirname, '/../../../public/login.html'));
};

// check login information
const doLogin = async (req, res, next) => {
  // const { email, password } = req.body;

  let token = jwt.sign(
    {
      email: 'a@b.com',
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: '5m',
    },
  );

  const pass = 'foo';
  if (pass === 'foo') {
    res.cookie('user', token);
    res.json({
      token,
    });
  } else {
    res.json({
      message: 'login failed',
    });
  }
};

const isAuthorized = (req, res, next) => {
  const token = req.cookies.user;
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    return {
      message: 'allowed',
      decoded,
    };
  } catch (e) {
    console.log(e);
    return {
      message: 'not allowed',
    };
  }
};

const testApi = (req, res, next) => {
  // console.log(req.message);
  // if (isAuthorized(req)) {
  //   res.send("success!");
  // } else {
  //   res.send("fail!");
  // }

  const token = req.cookies.user;
  try {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    res.send('authorized user');
  } catch (e) {
    console.log(e);
    res.send('not allowed');
  }
};

module.exports = Object.assign(
  {},
  {
    viewLogin,
    doLogin,
    isAuthorized,
    testApi,
  },
);
