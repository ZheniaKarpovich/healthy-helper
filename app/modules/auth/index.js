const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

const User = require('../../models/user');
const Module = require('../../core/module');
const jwtStrategy = require('./strategies/jwt');
const ErrorService = require('../../services/error');
const EmailService = require('../../services/email');
const emailStrategy = require('./strategies/email');

class Auth extends Module {

  middleware () { 
    passport.use('jwt', jwtStrategy);
    passport.use('email', emailStrategy);

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.query().where('id', id)[0];

        if (user) {
          return done(null, user.toJSON());
        }
    
        return done(null, null);
      } catch (error) {
        return done(error);
      }
    });
  }

  authEmail () {
    return passport.authenticate('email');
  }

  static isAuthenticated () {
    return passport.authenticate('jwt');
  }

  static async resend(id, origin, email) {
    const user = (await User.query().where('id', id))[0];
  
    if (user.active) {
      ErrorService.throw(400, 'user.isActivated');
    }
  
    await user.generateActivationCode();
    await EmailService.sendUserActivationEmail(email, origin, user.activationCode);
  }

  static async registerFlow (email, username, origin, password) {
    if (!username || !password) {
      ErrorService.throw(400);
    }
  
    let user = (await User.query().where('login', username))[0];
  
    if (user) {
      ErrorService.throw(400, 'user.isRegistered');
    }

    let isActivated = true;

    if (process.env.SHOULD_CONSIDER_ACCOUNT_ACTIVATION === 'true') {
      isActivated = false;
    }
    
    user = await User.create(username, email, password, isActivated);
    await user.generateActivationCode();
    
    if (process.env.SHOULD_CONSIDER_ACCOUNT_ACTIVATION === 'true') {
      await EmailService.sendUserActivationEmail(email, origin, user.activationCode);
    }

    return user.toJSON();
  }

  static async sendResetPasswordEmail(email, origin) {
    const user = await User.query().where('email', email);

    if (!user) {
      ErrorService.throw(400, 'user.emailNotFound');
    }
  
    await user.generatePasswordResetCode();
    await EmailService.sendForgotPasswordEmail(email, origin, user.passwordResetCode); 
  }

  static async resetPassword (code, password, ctx) {
    const user = await User.query().where('passwordResetCode', code );
    if (!user) {
      ErrorService.throw(400, 'user.notFound');
    }
  
    const hashPassword = await User.hashPassword(password);
    user.updateAndFetchById(user.id, {
      'password': hashPassword,
      'passwordResetCode': null,
      'isActivated': true
    });

    user.set('passwordResetCode', null);
    user.set('isPasswordReseted', false);
    user.set('isActivated', true);
    await user.save({ ...ctx });
  }

  async generateToken (ctx) {
    const { user } = ctx.state;

    if (!user) {
      ctx.status = 401;
    } else {
      const token = jwt.sign({ id: user.id }, 'secret');
  
      ctx.status = 200;
      ctx.body = { token };
    }
  }

  async register(ctx, next) {
    const { username, password, email } = ctx.request.body;
    const { origin } = ctx.request.header;
  
    const user = await Auth.registerFlow(email, username, origin, password, ctx);
  
    await ctx.login(user);
    await next();
  }

  async activateUser(ctx) {
    const { code } = ctx.query;
  
    const body = await User.activateUser(code);
  
    ctx.status = 200;
    ctx.body = body;
  }

  async activationCodeResend(ctx) { // test later
    const { user: { id, email } } = ctx.state;
    const { origin } = ctx.request.header;
  
    await Auth.resend(id, origin, email);
  
    ctx.status = 200;
  }

  async forgot(ctx) {
    const { email } = ctx.request.body;
    const { origin } = ctx.request.header;

    await Auth.sendResetPasswordEmail(email, origin, ctx);

    ctx.status = 200;
  }

  async reset(ctx) {
    const { code, password } = ctx.request.body;
  
    await Auth.resetPassword(code, password, ctx);
    ctx.status = 200;
  }

  mount () {
    const {
      reset,
      router,
      forgot,
      register,
      authEmail,
      activateUser,
      generateToken,
      activationCodeResend,
    } = this;

    router.get('/activate', activateUser);

    router.get('/activate/resend', Auth.isAuthenticated(), activationCodeResend);

    router.post('/forgot', forgot);

    router.post('/reset', reset);

    router.post('/login', authEmail(), generateToken);

    router.post('/register', register, generateToken);
  }

}

module.exports = Auth;
