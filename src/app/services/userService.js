const Query = require('@queries');

const authService = require('@services/authService');

const userServices = {};

/*
  user
 */
userServices.create = async ({
  name,
  email,
  password,
  profileImageUrl,
  profileThumbnailUrl,
  oAuth,
  userMeta,
}) => {
  /*
    get parameters
   */
  const defaultAuthoritiesId = await Query.config.findValueByKey('DEFAULT_AUTHORITIES_ID');

  // salt and hash
  const { salt, hashPassword } = await authService.createSaltAndHash(password);
  const authoritiesId = (defaultAuthoritiesId || 0) !== 0 ? defaultAuthoritiesId || 0 : 3;

  // check user exist
  const existUser = await Query.user.findByEmail(email);
  if (existUser) {
    return {
      error: true,
      message: 'user already exist',
    };
  }
  // Create User
  const t = await Query.sequelize.transaction();
  try {
    const user = await Query.user.create({
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
    await Query.userAuthorityRelation.create({
      usersId: user?.id,
      authoritiesId,
    }, { transaction: t }).then(() => { /* do nothing */ })
      .catch((err) => {
        global.logger.devError(err);
        return false;
      });

    if (oAuth) {
      await authService.createOAuthMeta({
        t,
        usersId: user?.id,
        ...oAuth,
      });
    }

    if (userMeta) {
      await Query.userMeta.createAll({
        t,
        prefix: oAuth.service,
        usersId: user?.id,
        userMeta,
      });
    }

    await t?.commit();
    return {
      error: false,
      message: 'user created',
    };
  } catch (e) {
    global.logger.devError(e);
    await t?.rollback();
    return {
      error: true,
      message: 'error occurred',
    };
  }
};

userServices.update = async (params) => {
  try {
    return Query?.user.updateProfile(params);
  } catch (e) {
    return e;
  }
};

userServices.getLoginUser = async (req) => {
  const loginState = await authService.getLoginState(req);
  if (!loginState?.isLogin) return false;

  return Query?.user.findByEmail(loginState?.decoded.email)
    .catch(e => {
      global.logger.devError(e);
      return false;
    });
};

userServices.findById = (usersId) => {
  return Query?.user.findById(usersId);
};

userServices.findUserByEmail = (email) => {
  return Query?.user.findByEmail(email);
};
/*
  password reset
 */
const resetCode = (updatedAt) => {
  return `${updatedAt.getTime()}`.substring(0, 6);
};

userServices.getResetCodeByEmail = async (email) => {
  const user = await Query?.user.findByEmail(email)
    .catch(e => {
      global.logger.devError(e);
      return false;
    });
  if (!user) return false;
  return resetCode(user?.updatedAt);
};

userServices.resetPassword = async ({ email, password, code }) => {
  const user = await Query?.user.findByEmail(email)
    .catch(e => {
      global.logger.devError(e);
      return false;
    });
  if (!user) return { error: true, message: 'user not found' };

  if (resetCode(user?.updatedAt) !== code) {
    return { error: true, message: 'Code not the corrected' };
  }

  /*
    create hash
   */
  // salt and hash
  const { salt, hashPassword } = await authService.createSaltAndHash(password);
  return Query?.user.updatePasswordByEmail({
    email, hashPassword, salt,
  })
    .then(r => {
      if (r[0]) return { error: false, message: 'success' };
      return { error: true, message: 'data not changed' };
    })
    .catch(e => {
      global.logger.devError(e);
      return {
        error: true,
        message: 'query error',
      };
    });
};

module.exports = userServices;
