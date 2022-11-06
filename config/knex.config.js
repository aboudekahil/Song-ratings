var config = require('./config');

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: config.config.HOST,
    port: config.config.PORT,
    user: config.config.USER,
    password: config.config.PASSWORD,
    database: config.config.DB,
  },
});

module.exports = knex;
