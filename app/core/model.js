const { Model: ObjectionModel, transaction } = require('objection');

class Model extends ObjectionModel {

  /**
   * Starts new transaction
   *
   * @returns {Promise<Transaction>}
   */
  static async startTransaction () {
    const knex = this.knex();
    return await transaction.start(knex);
  }

}

module.exports = Model;
