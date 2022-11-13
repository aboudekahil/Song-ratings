const moment = require('moment');
const knex = require('../config/knex.config');

exports.logIn = async (req, res) => {
  const { email, password } = req.body;

  let user = await knex('users')
    .where('user_email', email)
    .andWhere('user_password', password)
    .select('user_id', 'user_is_artist')
    .first();

  if (!user) {
    res.status(404).send('user not found');
    return;
  }

  if (user.user_is_artist) {
    let artistId = (
      await knex('artists')
        .where('artist_user_email', email)
        .select('artist_id')
        .first()
    ).artist_id;

    res.cookie('sid', artistId, {
      expire: moment().add(1, 'y'),
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  res.cookie('uid', user.user_id, {
    expire: moment().add(1, 'y'),
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
  });

  res.redirect('/');
};

exports.register = async (req, res) => {
  const { name, email, password, country, isArtist, stageName, dob } = req.body;

  let isArtistBool = !!isArtist;

  let userId, artistId;

  try {
    userId = await knex('users').insert({
      user_email: email,
      user_name: name,
      user_password: password,
      user_country: country,
      user_is_artist: +isArtistBool,
      user_dob: moment(dob).format('YYYY-MM-DD'),
    });
  } catch (err) {
    console.error(err);
    res.status(403).send('User already exists.');
    return;
  }

  res.cookie('uid', userId, {
    expire: moment().add(1, 'y'),
    secure: true,
    httpOnly: true,
  });

  if (isArtistBool) {
    artistId = await knex('artists').insert({
      artist_stagename: stageName,
      artist_user_email: email,
    });

    res.cookie('sid', artistId[0], {
      expire: moment().add(1, 'y'),
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  res.redirect('/');
};

exports.joinPage = async (req, res) => {
  if (req.cookies.uid) {
    res
      .status(403)
      .send('You cannot access this page.\nYou are already logged in.');
    return;
  }

  let countries = await knex('countries').select('*');
  res.render('join', { countries: countries });
};

exports.signOut = async (req, res) => {
  if (!req.cookies.uid) {
    res.status(403).send('bad request');
    return;
  }

  res.clearCookie('uid');
  res.clearCookie('sid');
  res.status(200).send('OK');
  res.end();
};
