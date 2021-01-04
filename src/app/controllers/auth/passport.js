/**
 * @brief Passport 정의.
 */

require('dotenv').config();

const passport = require('passport');
const passportJwt = require('passport-jwt');

const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('@models').user;

module.exports = () => {
  // Local Strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      ((email, password, done) => {
        return UserModel.findOne({ where: { email } })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: 'Incorrect email' });
            }
            const { salt } = user.dataValues;
            const dbPassword = user.dataValues.password;

            const hashPassword = crypto
              .createHash('sha512')
              .update(password + salt)
              .digest('hex');

            if (hashPassword === dbPassword) {
              user.update({
                last_login: new Date(),
              });
              return done(null, user, { message: 'Logged In Successfully' });
            }
            return done(null, false, { message: 'Incorrect password' });
          })
          .catch((err) => done(err));
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
        return UserModel.findOne({
          where: {
            id: jwtPayload.id,
          },
        })
          .then((user) => done(null, user))
          .catch((err) => done(err));
      }),
    ),
  );
};
