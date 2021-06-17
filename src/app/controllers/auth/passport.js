/**
 * @brief Passport 정의.
 */

const passport = require('passport');
const passportJwt = require('passport-jwt');

const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const encryption = require('@system/encryption');
const config = require('@root/src/config');

const LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

const Model = require('@models');

const checkOAuth = ({ service, accountId, accessToken, refreshToken, profile, done }) => {
  Model.oAuthMeta.findOne({ where: { service, accountId } })
    .then(user => {
      if (!user) {
        return done(null, false, {
          accessToken,
          refreshToken,
          profile,
          message: 'User Created',
        });
      }
      return done(null, user, {
        accessToken,
        refreshToken,
        profile,
        message: 'Logged In Successfully',
      });
    })
    .catch(err => done(err));
};

module.exports = () => {
  // Local Strategy
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      ((email, password, done) => {
        return Model.user.findOne({ where: { email } })
          .then(async (user) => {
            if (!user) {
              return done(null, false, { message: 'Incorrect email' });
            }
            const { salt } = user.dataValues;
            const dbPassword = user.dataValues.password;

            const hashPassword = await encryption.pbkdf2(password, salt);

            if (hashPassword === dbPassword) {
              return done(null, user, { message: 'Logged In Successfully' });
            }
            return done(null, false, { message: 'Incorrect password' });
          })
          .catch(err => done(err));
      }),
    ),
  );

  // JWT Strategy
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret.JWT_SECRET_KEY,
      },
      ((jwtPayload, done) => {
        return Model.user.findOne({
          where: {
            id: jwtPayload.id,
          },
        })
          .then(user => done(null, user))
          .catch(err => done(err));
      }),
    ),
  );

  // clientSecret 를 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
  if (config.oAuth.KAKAO_JS_APP_KEY) {
    passport.use('kakao', new KakaoStrategy({
      clientID: config.oAuth.KAKAO_JS_APP_KEY,
      clientSecret: config.oAuth.KAKAO_CLIENT_SECRET,
      callbackURL: `${config.env.SERVER_DOMAIN}/auth/kakao`,
    },
    (accessToken, refreshToken, profile, done) => {
      checkOAuth({
        service: 'kakao',
        accountId: profile.id,
        accessToken,
        refreshToken,
        profile,
        done,
      });
    }));
  }

  if (config.oAuth.NAVER_CLIENT_ID) {
    passport.use('naver', new NaverStrategy({
      clientID: config.oAuth.NAVER_CLIENT_ID,
      clientSecret: config.oAuth.NAVER_CLIENT_SECRET,
      callbackURL: `${config.env.SERVER_DOMAIN}/auth/naver`,
    }, (accessToken, refreshToken, profile, done) => {
      checkOAuth({
        service: 'naver',
        accountId: profile.id,
        accessToken,
        refreshToken,
        profile,
        done,
      });
    }));
  }
};
