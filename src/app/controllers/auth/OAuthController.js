/* eslint no-underscore-dangle: 0 */
/* eslint consistent-return: 0 */
const passport = require('passport');
const authService = require('@services/authService');
const userService = require('@services/userService');

const controllers = {};

controllers.doKakaoAuth = async (req, res) => {
  const { period, redirectUrl } = await authService.initialParamsForLogin();
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
    const userMeta = {};
    let isSuccess = false;

    if (user) {
      isSuccess = true;
    } else {
      // Email that already exists
      const existUser = await userService.findUserByEmail(payload.email);

      if (existUser) {
        isSuccess = await authService.addSocialAccount({
          usersId: existUser?.id,
          service: 'kakao',
          accountId: data.profile.id,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      } else {
        // If there is no user, sign up
        await userService.create({
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
          userMeta,
        })
          .then(() => {
            isSuccess = true;
          })
          .catch(() => {
            return global.message.badRequest(res, 'register failed');
          });
      }
    }

    // do login
    if (isSuccess) {
      authService.login(req, res, loginParams);
    } else {
      return global.message.unauthorized(res, 'login failed');
    }
  })(req, res, redirectUrl, period);
};

controllers.doNaverAuth = async (req, res) => {
  const { period, redirectUrl } = await authService.initialParamsForLogin();
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
      const existUser = await userService.findUserByEmail(payload.email);

      if (existUser) {
        isSuccess = await authService.addSocialAccount({
          usersId: existUser?.id,
          service: 'naver',
          accountId: data.profile.id,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userMeta,
        });
      } else {
        // If there is no user, sign up
        await userService.create({
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
            return global.message.badRequest(res, 'register failed');
          });
      }
    }

    // do login
    if (isSuccess) {
      authService.login(req, res, loginParams);
    } else {
      return global.message.unauthorized(res, 'login failed');
    }
  })(req, res, redirectUrl, period);
};

module.exports = controllers;
