const passportJWT = require("passport-jwt");

const users = require("./sample-data");
const config = require("./jwt-config");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

module.exports = passport => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (users[0].email == jwt_payload.email) {
        return done(null, users[0]);
      } else {
        return done(null, false);
      }
    })
  );
};
