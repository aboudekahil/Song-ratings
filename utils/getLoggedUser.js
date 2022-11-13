const moment = require('moment');
const knex = require('../config/knex.config');

const getLoggedUser = async (req) => {
  let user = !!req.cookies.uid
    ? await knex('users')
        .leftJoin(
          'artists',
          'artists.artist_user_email',
          '=',
          'users.user_email'
        )
        .where('user_id', req.cookies.uid)
        .select('*')
        .first()
    : 0;

  if (user) {
    user.user_dob = moment(user.user_dob).format('YYYY-MM-DD');
  }

  return user;
};

module.exports = getLoggedUser;
