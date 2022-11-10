const moment = require('moment');
const knex = require('../config/knex.config');

exports.updateSong = async (req, res) => {
  const { id, name, length, album } = req.body;

  await knex('songs').where('song_id', id).update({
    song_name: name,
    song_length: length,
    song_album: album,
  });

  res.redirect('/');
};

exports.addASong = async (req, res) => {
  const { name, length, album, releaseDate } = req.body;
  await knex('songs').insert({
    song_name: name,
    song_length: length,
    song_artist: req.cookies.sid,
    song_in_album: album || null,
    song_releasedate: moment(releaseDate).format('YYYY-MM-DD'),
  });

  res.redirect('/');
};

exports.getSong = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).send('bad request');
    return;
  }

  let song = await knex('songs').where('song_id', id).select('*').first();

  if (!song) {
    res.status(404).send('song not found');
    return;
  }

  let reviews = await knex('ratings')
    .where('rating_song', id)
    .innerJoin('users', 'users.user_id', 'ratings.rating_user')
    .select(
      'user_name',
      'rating_last_updated',
      'rating_stars',
      'rating_review'
    );

  res.status(200).render('song', { song, reviews });
};

exports.addSong = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('forbidden request, you are not an artist');
    return;
  }

  let albums = await knex('albums')
    .where('album_artist', req.cookies.sid)
    .select('album_id', 'album_name');

  res.status(200).render('add_song', { albums });
};
