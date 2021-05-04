const jwt = require('jsonwebtoken');
const Model = require('@models');
const encryption = require('@system/encryption');
const requestHandler = require('@utils/requestHandler');
const validation = require('@utils/validation');
const config = require('@root/src/config');

const authService = {};
/*
  Login
 */
authService.initialParamsForLogin = async () => {
  const authPeriod = await Model.config.findValueByKey('DEFAULT_AUTH_PERIOD');
  const redirectUriAfterLogin = '/';

  const period = authPeriod || 0;
  const redirectUrl = `${redirectUriAfterLogin}`;

  return {
    period,
    redirectUrl,
  };
};

authService.login = (req, res, { payload, period, redirectUrl, message }) => {
  // payload Validation Check
  const valErr = validation.validator(res, payload, {
    // id: validation.check.common.reqInteger,
    email: validation.check.common.reqString,
  });
  if (valErr) return global.message.badRequest(res, valErr.message, valErr.data);

  // Do login
  return req.login(payload, { session: false }, loginError => {
    if (loginError) {
      global.logger.devError(loginError);
      return global.message.badRequest(res, 'login failed', loginError);
    }
    const expiresIn = 1000 * 60 * 60 * 24 * period; // date
    return createToken(payload)
      .then(token => {
        // update last login
        Model.user.updateLastLoginByEmail(payload?.email);

        const cookieOptions = {
          maxAge: expiresIn,
          sameSite: 'Lax',
        };
        res.cookie('jwt', token, cookieOptions);
        return global.message.ok(res, message, {
          cookie: {
            name: 'jwt',
            value: token,
            ...cookieOptions,
          },
          redirectUrl,
          payload,
        });
      })
      .catch(() => {
        console.log('#');
        return global.message.badRequest(res, 'login failed', {});
      });
  });
};

/*
  Register
 */
authService.createSaltAndHash = async (password) => {
  const salt = `${Math.round(new Date().valueOf() * Math.random())}`;
  const hashPassword = await encryption.pbkdf2(password, salt);
  return { salt, hashPassword };
};

authService.createOAuthMeta = ({ t, usersId, service, accountId, accessToken, refreshToken }) => {
  return Model.oAuthMeta.create({
    usersId, service, accountId, accessToken, refreshToken,
  }, { transaction: t })
    .catch(err => {
      global.logger.devError(err);
      return false;
    });
};

authService.addSocialAccount = async ({
  usersId,
  service,
  accountId,
  accessToken,
  refreshToken,
  userMeta,
}) => {
  const t = await Model.sequelize.transaction();
  let isSuccess = false;
  try {
    await authService.createOAuthMeta({
      t,
      usersId,
      service,
      accountId,
      accessToken,
      refreshToken,
    }).then(() => {
      isSuccess = true;
    });
    if (userMeta) {
      await authService.createUserMeta({
        t,
        prefix: service,
        usersId,
        userMeta,
      });
    }
    await t?.commit();
    isSuccess = true;
  } catch (e) {
    await t?.rollback();
    isSuccess = false;
    global.logger.devError(e);
  }

  return isSuccess;
};

/*
  Authentication
 */
const createToken = async (payload) => {
  const authPeriod = await Model.config.findValueByKey('DEFAULT_AUTH_PERIOD');
  return jwt.sign(
    { ...payload, access: 'authenticated' },
    config.secret.JWT_SECRET_KEY,
    {
      algorithm: 'HS256',
      expiresIn: `${authPeriod}d`,
      issuer: config.env.APP_NAME,
    },
  );
};

/*
  Check Authentication
 */
authService.getLoginState = (req) => {
  const token = requestHandler.getJwt(req);
  const sign = global.env.secret.JWT_SECRET_KEY;

  const result = (isLogin, message, decoded = null) => {
    return {
      isLogin,
      message,
      decoded,
    };
  };

  return jwt.verify(token, sign, (err, decoded) => {
    if (err || !decoded) {
      global.logger.dev('invalid token');
      return result(false, 'invalid token');
    }
    if (
      decoded
      && (!decoded.access || decoded.access === 'unauthenticated')
    ) {
      global.logger.dev('unauthenticated token');
      return result(false, 'unauthenticated token');
    }

    if (decoded && decoded.access === 'authenticated') {
      global.logger.dev('valid token');
      return result(true, 'login Succeed', decoded);
    }

    global.logger.dev('something suspicious');
    return result(false, 'something suspicious');
  });
};

authService.getAuthState = async (req, authoritiesIds = []) => {
  const loginState = authService.getLoginState(req);
  const result = (isAllowed, message) => {
    const m = message || loginState.message;
    return {
      isAllowed,
      ...loginState,
      message: isAllowed ? 'Access Allowed' : m,
    };
  };

  // not logged in
  if (!loginState.isLogin) {
    if (authoritiesIds.length !== 0) return result(false);
    return result(true);
  }

  // logged in
  const user = await Model.user.findByEmail(loginState.decoded?.email)
    .catch(e => {
      global.logger.devError(e);
      return false;
    });

  if (!user) return result(false, 'user not found');

  // authority
  const authority = await Model.userAuthorityRelation.findByUsersId(user?.id)
    .catch(e => {
      global.logger.devError(e);
      return false;
    });

  if (!authority) return result(false, 'auth not found');
  if (authoritiesIds.includes(authority?.id)) return result(true);
  return result(false);
};

module.exports = authService;
