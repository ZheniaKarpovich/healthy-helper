const LocalStrategy = require('passport-local').Strategy;

const User = require('../../../models/user');

const handler = async (email, password, done) => {
  try {
    const user = (await User.query().where('login', email))[0];

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (!(await user.validatePassword(password))) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    const json = user.toJSON();
    return done(null, { ...json });
  } catch (error) {
    return done(error, false);
  }
};

module.exports = new LocalStrategy(handler); // to change name of request field add options object