const passport = require('passport');
const AuthService = require('@services/AuthService');

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
    // 에러 검증
    if (err) return res.json(err);
    // 데이터 정리
    const payload = {
      // eslint-disable-next-line no-underscore-dangle
      email: user.email || data.profile?._json?.kakao_account.email,
    };
    const loginParams = {
      payload,
      period,
      redirectUrl,
      message: data.message,
    };

    console.log('#3');

    // 유저가 없으면 회원가입 시킨다
    if (!user) {
      const isUserCreated = await AuthService.createUser({
        name: data.profile.displayName || data.profile.username,
        email: payload.email,
        password: String(data.profile.id),
        // eslint-disable-next-line no-underscore-dangle
        profileImageUrl: data.profile?._json?.kakao_account.profile.profile_image_url,
        // eslint-disable-next-line no-underscore-dangle
        profileThumbnailUrl: data.profile?._json?.kakao_account.profile.thumbnail_image_url,
        oAuth: {
          service: 'kakao',
          accountId: data.profile.id,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      });
      if (!isUserCreated) {
        return global.message.failed(res, 'fail_to_create_user');
      }
    }
    // console.log(err, user, data);

    // 로그인 시킨다
    AuthService.login(req, res, loginParams);
  })(req, res, redirectUrl, period);
};

module.exports = controllers;
