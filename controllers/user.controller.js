const knex = require('../config/knex.config');
const getLoggedUser = require('../utils/getLoggedUser');

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

exports.getEditProfile = async (req, res) => {
  if (!req.cookies.uid) {
    res.status(400).send('bad request');
    return;
  }

  let user = await getLoggedUser(req);
  let countries = await knex('countries').select('*');

  let isArtist = !!req.cookies.sid;

  res.render('edit_profile', { user, countries, isArtist });
};

exports.editProfile = async (req, res) => {
  if (!req.cookies.uid) {
    res.status(400).send('bad request');
    return;
  }

  const { name, email, password, country, dob, stageName } = req.body;

  await knex('users').where('user_id', req.cookies.uid).update({
    user_name: name,
    user_email: email,
    user_password: password,
    user_country: country,
    user_dob: dob,
  });

  if (req.cookies.sid) {
    await knex('artists').where('artist_id', req.cookies.sid).update({
      artist_stagename: stageName,
    });
  }

  res.redirect('/');
};
