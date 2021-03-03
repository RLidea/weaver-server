const jwt = require('jsonwebtoken');
const Model = require('@models');
const encryption = require('@system/encryption');
const requestHandler = require('@utils/requestHandler');

/*
  Login
 */
const login = (req, res, params) => {
  const { payload, period, redirectUrl, message } = params;
  req.login(payload, { session: false }, loginError => {
    if (loginError) {
      global.logger.devError(loginError);
      res.json(loginError);
    }
    const expiresIn = 1000 * 60 * 60 * 24 * period; // date
    createToken(payload)
      .then(token => {
        const cookieOptions = {
          maxAge: expiresIn,
          sameSite: 'Lax',
        };
        res.cookie('jwt', token, cookieOptions);
        res.json({
          error: false,
          message,
          data: {
            cookie: {
              name: 'jwt',
              value: token,
              ...cookieOptions,
            },
            redirectUrl,
            payload,
          },
        });
      })
      .catch(() => {
        res.json({
          error: true,
          message: 'login_failed',
          data: null,
        });
      });
  });
};

const initialParamsForLogin = async () => {
  const authPeriod = '3';
  const redirectUriAfterLogin = '/';

  const period = authPeriod || 0;
  const redirectUrl = `${redirectUriAfterLogin}`;

  return {
    period,
    redirectUrl,
  };
};

/*
  Register
 */
const createSaltAndHash = (password) => {
  const salt = `${Math.round(new Date().valueOf() * Math.random())}`;
  const hashPassword = encryption.createHash(password, salt);
  return { salt, hashPassword };
};

/*
  Authentication
 */
const createToken = async (payload) => {
  const authPeriod = 3;
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

/*
  Check Authentication
 */
const getLoginInfo = (req) => {
  // Validation
  const token = requestHandler.getJwt(req);
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
      global.logger.dev('invalid token');
      return objResult(false, 'invalid token');
    }

    if (
      decoded
      && (!decoded.access || decoded.access === 'unauthenticated')
    ) {
      global.logger.dev('unauthenticated token');
      return objResult(false, 'unauthenticated token');
    }

    if (decoded && decoded.access === 'authenticated') {
      global.logger.dev('valid token');
      return objResult(true, 'login Succeed', decoded);
    }

    global.logger.dev('something suspicious');
    return objResult(false, 'something suspicious');
  });
};

const getAuthInfo = async (req, authorities_ids = []) => {
  const loginInfo = getLoginInfo(req);
  const objResult = (isAllowed) => {
    return {
      isAllowed,
      ...loginInfo,
      message: isAllowed ? 'Access Allowed' : loginInfo.message,
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
  })
    .then((user) => {
      if (user === null) {
        return {
          error: true,
          message: 'user_not_found',
        };
      }
      return user.dataValues.id;
    })
    .catch(e => {
      global.logger.devError(e);
      return {
        error: true,
        message: 'user_not_found',
      };
    });

  const authorities_id = await Model.user_authority_relation.findOne({
    where: {
      users_id,
    },
  })
    .then((auth) => auth?.dataValues?.authorities_id)
    .catch(e => {
      global.logger.devError(e);
      return {
        error: true,
        message: 'auth_not_found',
      };
    });

  if (authorities_ids.includes(authorities_id)) {
    return objResult(true);
  }
  return objResult(false);
};

const getLoginUser = async (req) => {
  const token = requestHandler.getJwt(req);
  if (token === undefined) return null;

  const email = await getLoginInfo(req).decoded.email;
  const user = Model.user.findOne({
    attributes: {
      exclude: [
        'password',
        'salt',
      ],
    },
    where: {
      email,
    },
  })
    .then(d => d.dataValues)
    .catch(e => {
      global.logger.devError(e);
      return false;
    });

  return user;
};

module.exports = {
  login,
  initialParamsForLogin,
  createSaltAndHash,
  createToken,
  getLoginInfo,
  getAuthInfo,
  getLoginUser,
};
