const knex = require('../config/knex.config');
const moment = require('moment');
const toMMSS = require('../utils/toMMSS');
const getLoggedUser = require('../utils/getLoggedUser');

exports.updateAnAlbum = async (req, res) => {
  const { name, releaseDate } = req.body;

  await knex('albums')
    .where('album_artist', req.cookies.sid)
    .update({
      album_name: name,
      album_releasedate: moment(releaseDate).format('YYYY-MM-DD'),
    });

  let artist = (
    await knex('artists')
      .where('artist_id', req.cookies.sid)
      .select('artist_stagename')
      .first()
  ).artist_stagename;

  res.redirect(`/artists/${artist}`);
};

exports.addAnAlbum = async (req, res) => {
  const { name, releaseDate } = req.body;

  await knex('albums').insert({
    album_name: name,
    album_releasedate: moment(releaseDate).format('YYYY-MM-DD'),
    album_artist: req.cookies.sid,
  });

  let artist = (
    await knex('artists')
      .where('artist_id', req.cookies.sid)
      .select('artist_stagename')
      .first()
  ).artist_stagename;

  res.redirect(`/artists/${artist}`);
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
    'YYYY-MM-DD'
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

exports.addAlbum = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('forbidden request, you are not an artist');
    return;
  }
  let user = await getLoggedUser(req);
  res.render('add_album', { user, isUpdate: false });
};

exports.deleteAlbum = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('forbidden request, you are not an artist');
    return;
  }

  let { albumId } = req.body;

  await knex('albums').where('album_id', albumId).del();
  res.end();
};

exports.updateAlbum = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('forbidden request, you are not an artist');
    return;
  }

  let { id } = req.query;

  let album = await knex('albums').where('album_id', id).select('*').first();
  album.album_releasedate = moment(album.album_releasedate).format(
    'YYYY-MM-DD'
  );

  let user = await getLoggedUser(req);

  res.render('add_album', { user, isUpdate: true, album });
};
