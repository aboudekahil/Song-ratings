const knex = require('../config/knex.config');

exports.getProfile = async (req, res) => {
  if (!req.params.username) {
    res.status(400).send('Bad request.');
    return;
  }

  let user = await knex('users')
    .where('user_name', req.params.username)
    .select('*')
    .first();

  res.render('profile', { user });
};
