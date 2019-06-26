const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('../../../models/user');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret', // export from config
};

const handler = async ({ id }, done) => {
  try {
    const user = (await User.query().where('id', id))[0];

    if (user && user.isPasswordReseted) {
      return done(null, false);
    }

    if (!user) {
      return done(null, false);
    }

    const json = user.toJSON();
    if (process.env.SHOULD_CONSIDER_ACCOUNT_ACTIVATION === 'false') {
      json.active = true;
    }

    return done(null, { ...json });
  } catch (error) {
    return done(error);
  }
};

module.exports = new JwtStrategy(options, handler);
