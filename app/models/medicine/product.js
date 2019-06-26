const Model = require('../../core/model');

class Product extends Model {

  static get tableName () {
    return 'product';
  }
}

module.exports = Product;