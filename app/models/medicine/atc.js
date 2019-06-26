const Model = require('../../core/model');
class Atc extends Model {

  static get tableName () {
    return 'atc';
  }
}

module.exports = Atc;
