const jwt = require('jsonwebtoken');
const Model = require('@models');
const encryption = require('@system/encryption');
const requestHandler = require('@utils/requestHandler');
const ConfigService = require('@services/ConfigService');

const services = {};
/*
  Login
 */
services.login = (req, res, params) => {
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

services.initialParamsForLogin = async () => {
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
services.createSaltAndHash = async (password) => {
  const salt = `${Math.round(new Date().valueOf() * Math.random())}`;
  const hashPassword = await encryption.pbkdf2(password, salt);
  return { salt, hashPassword };
};

services.createUser = async ({
  name,
  email,
  password,
  profileImageUrl,
  profileThumbnailUrl,
  oAuth,
}) => {
  const defaultAuthorities = (await ConfigService.get('DEFAULT_AUTHORITIES_ID'))?.value;

  // salt and hash
  const { salt, hashPassword } = await services.createSaltAndHash(password);
  const authoritiesId = (defaultAuthorities || 0) !== 0 ? defaultAuthorities || 0 : 3;

  // Crate User
  const t = await Model.sequelize.transaction();
  try {
    const user = await Model.user.create({
      name,
      email,
      password: hashPassword,
      profileImageUrl,
      profileThumbnailUrl,
      salt,
    }, { transaction: t })
      .then(d => d.dataValues)
      .catch((err) => {
        global.logger.devError(err);
        return false;
      });

    // Create user-auth relations
    await Model.userAuthorityRelation.create({
      usersId: user?.id,
      authoritiesId,
    }, { transaction: t }).then(() => { /* do nothing */ })
      .catch((err) => {
        global.logger.devError(err);
        return false;
      });

    if (oAuth) {
      await services.createOauthMeta({
        t,
        usersId: user?.id,
        ...oAuth,
      });
    }

    await t.commit();
    return true;
  } catch (e) {
    global.logger.devError(e);
    await t.rollback();
    return false;
  }
};

services.createOauthMeta = async ({
  t, usersId, service, accountId, accessToken, refreshToken,
}) => {
  await Model.oAuthMeta.create({
    usersId,
    service,
    accountId,
    accessToken,
    refreshToken,
  }, { transaction: t }).catch(err => {
    global.logger.devError(err);
    return false;
  });
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

services.getAuthInfo = async (req, authoritiesIds = []) => {
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
    if (authoritiesIds.length !== 0) {
      return objResult(false);
    }
    return objResult(true);
  }

  // logged in
  const usersId = await Model.user.findOne({
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

  const authoritiesId = await Model.userAuthorityRelation.findOne({
    where: {
      usersId,
    },
  })
    .then((auth) => auth?.dataValues?.authoritiesId)
    .catch(e => {
      global.logger.devError(e);
      return {
        error: true,
        message: 'auth_not_found',
      };
    });

  if (authoritiesIds.includes(authoritiesId)) {
    return objResult(true);
  }
  return objResult(false);
};

services.getLoginUser = async (req) => {
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

module.exports = services;
