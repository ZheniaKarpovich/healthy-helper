const Model = require('../../core/model');

class Document extends Model {

  static get tableName () {
    return 'document';
  }
}

module.exports = Document;