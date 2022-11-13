const knex = require('../config/knex.config');
const moment = require('moment');
const toMMSS = require('../utils/toMMSS');
const getLoggedUser = require('../utils/getLoggedUser');

exports.updateAlbum = async (req, res) => {
  const { name, releaseDate } = req.body;

  await knex('albums')
    .where('album_artist', req.cookies.sid)
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
  const { artistName, albumName } = req.params;

  let artistId = await knex('artists')
    .select('artist_id')
    .where('artist_stagename', artistName)
    .first();

  if (!artistId) {
    res.status(404).send('artist not found');
    return;
  }

  artistId = artistId.artist_id;

  let album = await knex('albums')
    .where('album_name', albumName)
    .innerJoin('artists', 'artist_id', '=', 'album_artist')
    .andWhere('album_artist', artistId)
    .select('album_id', 'album_name', 'album_releasedate', 'artist_stagename')
    .first();

  if (!album) {
    res.status(404).send('album not found');
    return;
  }

  album.album_releasedate = moment(album.album_releasedate).format(
    'DD/MM/YYYY'
  );

  let songs = await knex('songs')
    .where('song_in_album', album.album_id)
    .select('*');

  songs.forEach((song) => {
    song.song_length = toMMSS(song.song_length);
  });

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

  let user = await getLoggedUser(req);

  res.status(200).render('album', { album, songs, avgStars, user });
};
