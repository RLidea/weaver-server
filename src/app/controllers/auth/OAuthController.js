/* eslint no-underscore-dangle: 0 */
/* eslint consistent-return: 0 */
const passport = require('passport');
const AuthService = require('@services/AuthService');
const Model = require('@models');

const controllers = {};

controllers.viewLogin = (req, res) => {
  return res.render('oauth', {
    title: 'Login',
    page: 'login',
  });
};

controllers.doKakaoAuth = async (req, res) => {
  const { period, redirectUrl } = await AuthService.initialParamsForLogin();
  passport.authenticate('kakao', {
    failureRedirect: '#!/auth/kakao',
  }, async (err, user, data) => {
    if (err) return res.json(err);
    // data
    const payload = {
      email: user.email || data.profile?._json?.kakao_account.email,
    };
    const loginParams = {
      payload,
      period,
      redirectUrl,
      message: data.message,
    };
    let isSuccess = false;

    if (user) {
      isSuccess = true;
    } else {
      // Email that already exists
      const existUser = await AuthService.findUserByEmail(payload.email);

      if (existUser) {
        await AuthService.createOAuthMeta({
          usersId: existUser.id,
          service: 'kakao',
          accountId: data.profile.id,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }).then(() => {
          isSuccess = true;
        });
      } else {
        // If there is no user, sign up
        await AuthService.createUser({
          name: data.profile.displayName || data.profile.username,
          email: payload.email,
          password: String(data.profile.id),
          profileImageUrl: data.profile?._json?.kakao_account.profile.profile_image_url,
          profileThumbnailUrl: data.profile?._json?.kakao_account.profile.thumbnail_image_url,
          oAuth: {
            service: 'kakao',
            accountId: data.profile.id,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
          userMeta: {
            id: data.profile.id,
          },
        })
          .then(() => {
            isSuccess = true;
          })
          .catch(() => {
            return global.message.failed(res, 'fail_to_create_user');
          });
      }
    }

    // do login
    if (isSuccess) {
      AuthService.login(req, res, loginParams);
    } else {
      return global.message.failed(res, 'fail_to_login_user');
    }
  })(req, res, redirectUrl, period);
};

controllers.doNaverAuth = async (req, res) => {
  const { period, redirectUrl } = await AuthService.initialParamsForLogin();
  passport.authenticate('naver', {
    failureRedirect: '#!/auth/naver',
  }, async (err, user, data) => {
    if (err) return res.json(err);
    // data
    const payload = {
      email: user.email || data.profile._json?.email,
    };
    const loginParams = {
      payload,
      period,
      redirectUrl,
      message: data.message,
    };
    let isSuccess = false;
    const userMeta = {
      age: data.profile._json?.age,
      birthday: data.profile._json?.birthday,
    };

    if (user) {
      isSuccess = true;
    } else {
      // Email that already exists
      const existUser = await AuthService.findUserByEmail(payload.email);

      if (existUser) {
        const t = await Model.sequelize.transaction();
        try {
          await AuthService.createOAuthMeta({
            usersId: existUser.id,
            service: 'naver',
            accountId: data.profile.id,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }, { transaction: t }).then(() => {
            isSuccess = true;
          });
          await AuthService.createUserMeta({
            prefix: 'naver',
            usersId: existUser.id,
            userMeta,
          }, { transaction: t });
          await t.commit();
          isSuccess = true;
        } catch (e) {
          await t.rollback();
          global.logger.devError(e);
          return global.message.failed(res, 'fail_to_create_user');
        }
      } else {
        // If there is no user, sign up
        await AuthService.createUser({
          name: data.profile.displayName || data.profile._json?.nickname,
          email: payload.email,
          password: String(data.profile.id),
          profileImageUrl: data.profile._json?.profile_image,
          profileThumbnailUrl: data.profile._json?.profile_image,
          oAuth: {
            service: 'naver',
            accountId: data.profile.id,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
          userMeta,
        })
          .then(() => {
            isSuccess = true;
          })
          .catch(() => {
            return global.message.failed(res, 'fail_to_create_user');
          });
      }
    }

    // do login
    if (isSuccess) {
      AuthService.login(req, res, loginParams);
    } else {
      return global.message.failed(res, 'fail_to_login_user');
    }
  })(req, res, redirectUrl, period);
};

module.exports = controllers;
