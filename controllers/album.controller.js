const knex = require('../config/knex.config');
const moment = require('moment');

exports.updateAlbum = async (req, res) => {
  const { id, name, releaseDate } = req.body;

  await knex('albums')
    .where('album_id', id)
    .update({
      album_name: name,
      album_releasedate: moment(releaseDate).format('YYYY-MM-DD'),
    });

  res.redirect('/');
};

exports.addAlbum = async (req, res) => {
  const { name, releaseDate } = req.body;

  await knex('albums').insert({
    album_name: name,
    album_releasedate: moment(releaseDate).format('YYYY-MM-DD'),
    album_artist: req.cookies.sid,
  });

  res.redirect('/');
};

exports.getAlbum = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).send('bad request');
    return;
  }

  let album = await knex('albums').where('album_id', id).select('*').first();

  if (!album) {
    res.status(404).send('album not found');
    return;
  }

  let songs = await knex('songs').where('song_in_album', id).select('*');

  let avgStars = (
    await knex('ratings')
      .where(
        'rating_song',
        'in',
        songs.map((song) => song.song_id)
      )
      .avg('rating_stars as stars')
      .first()
  ).stars;

  res.status(200).render('album', { album, songs, avgStars });
};
