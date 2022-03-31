const User = require('../models/user');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
  },
  async function (jwtPayload, done) {
    console.log(jwtPayload);
    const user = await User.findById(jwtPayload._id).catch((err) => done(err));

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }
);

module.exports = jwtStrategy;
