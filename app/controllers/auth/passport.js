/**
 * @brief Passport 정의.
 */

require('dotenv').config();

const passport = require('passport');
const passportJwt = require('passport-jwt');
const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../../models').user;

module.exports = () => {
  // Local Strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      function(email, password, done) {
        console.log('@passport.js/LocalStrategy', email, password);
        return UserModel.findOne({ where: { email, password } })
          .then(user => {
            console.log('user');
            console.log(user);
            if (!user) {
              return done(null, false, { message: 'Incorrect email or password' });
            }
            return done(null, user, { message: 'Logged In Successfully' });
          })
          .catch(err => done(err));
      },
    ),
  );

  // JWT Strategy
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY,
      },
      function(jwtPayload, done) {
        return UserModel.findOne({
          where: {
            id: jwtPayload.id,
          },
        })
          .then(user => done(null, user))
          .catch(err => done(err));
      },
    ),
  );
};
