/**
 * @brief Passport 정의.
 */

require('dotenv').config();

const passport = require('passport');
const passportJwt = require('passport-jwt');

const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const encryption = require('@system/encryption');
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
              user.update({
                lastLogin: new Date(),
              });
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
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY,
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

  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_JS_APP_KEY,
    clientSecret: process.env.KAKAO_CLIENT_SECRET, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
    callbackURL: `${process.env.SERVER_DOMAIN}/auth/kakao`,
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

  passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_DOMAIN}/auth/naver`,
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
};
