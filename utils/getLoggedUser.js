const knex = require('../config/knex.config');

const getLoggedUser = async (req) => {
  return !!req.cookies.uid
    ? await knex('users').where('user_id', req.cookies.uid).select('*').first()
    : 0;
};

module.exports = getLoggedUser;
