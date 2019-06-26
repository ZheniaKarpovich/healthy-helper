const Knex = require('knex');
const { Model } = require('objection');

/**
 * Configure database connection.
 * Must be called after env configuration.
 */
function connection () {
  const {
    DB_CLIENT,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
  } = process.env;

  const knex = Knex({
    client: DB_CLIENT,
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    }
  });

  Model.knex(knex);
}

module.exports = connection;
