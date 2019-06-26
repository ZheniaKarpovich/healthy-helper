const crypto = require('crypto');
const bcrypt = require('bcrypt');

const Model = require('../../core/model');
const ErrorService = require('../../services/error');


class User extends Model {

  static get tableName () {
    return 'user';
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
  
    return hash;
  }

  static async create (login, email, password, active) {
    const hashPassword = await User.hashPassword(password);
    const created = (new Date()).getTime();

    const user = {
      login,
      email,
      active,
      created,
      password: hashPassword,
    };

    return await User.query().insert(user);
  }

  static async activateUser (code) {
    let user = await User.query().where('activationCode', code);
    if (!user) {
      ErrorService.throw(400, 'user.notFound');
    }

    user = await User.query().updateAndFetchById(user.id, { 'active': false, 'activationCode': null });

    return user;
  } 

  async validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  async generateActivationCode() {
    const code = await crypto.randomBytes(32).toString('hex');

    await User.query().patchAndFetchById(this.id, { 'activationCode': code });
  }
  
  async generatePasswordResetCode() {
    const code = await crypto.randomBytes(32).toString('hex');

    await User.query().updateAndFetchById(this.id, { 'passwordResetCode': code });
  }
}

module.exports = User;
