const Model = require('../../core/model');

class PhThGroups extends Model {

  static get tableName () {
    return 'phthgroups';
  }
}

module.exports = PhThGroups;