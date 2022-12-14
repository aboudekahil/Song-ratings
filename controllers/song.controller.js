const moment = require('moment');
const knex = require('../config/knex.config');
const getLoggedUser = require('../utils/getLoggedUser');
const toMMSS = require('../utils/toMMSS');

exports.updateASong = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('Forbidden request you are not an artist');
    return;
  }

  const { name, length, album, releaseDate } = req.body;

  await knex('songs')
    .where('song_artist', req.cookies.sid)
    .update({
      song_name: name,
      song_length: length,
      song_in_album: album || null,
      song_releasedate: moment(releaseDate).format('YYYY-MM-DD'),
    });

  let artist = (
    await knex('artists')
      .where('artist_id', req.cookies.sid)
      .select('artist_stagename')
      .first()
  ).artist_stagename;

  res.redirect(`/artists/${artist}`);
};

exports.addASong = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('Forbidden request you are not an artist');
    return;
  }

  const { name, length, album, releaseDate } = req.body;
  await knex('songs').insert({
    song_name: name,
    song_length: length,
    song_artist: req.cookies.sid,
    song_in_album: album || null,
    song_releasedate: moment(releaseDate).format('YYYY-MM-DD'),
  });

  let artist = (
    await knex('artists')
      .where('artist_id', req.cookies.sid)
      .select('artist_stagename')
      .first()
  ).artist_stagename;

  res.redirect(`/artists/${artist}`);
};

exports.getSong = async (req, res) => {
  const { artistName, songName } = req.params;

  let artistId = await knex('artists')
    .select('artist_id')
    .where('artist_stagename', artistName)
    .first();

  if (!artistId) {
    res.status(404).send('artist not found');
    return;
  }

  artistId = artistId.artist_id;

  let song = await knex('songs')
    .innerJoin('artists', 'artists.artist_id', '=', 'songs.song_artist')
    .leftJoin('albums', 'albums.album_id', '=', 'songs.song_in_album')
    .where('song_name', songName)
    .andWhere('song_artist', artistId)
    .select(
      'song_id',
      'song_name',
      'song_length',
      'song_releasedate',
      'artist_stagename',
      'album_name'
    )
    .first();

  song.song_releasedate = moment(song.song_releasedate).format('YYYY-MM-DD');
  song.song_length = toMMSS(song.song_length);

  if (!song) {
    res.status(404).send('song not found');
    return;
  }

  let reviews = await knex('ratings')
    .where('rating_song', song.song_id)
    .leftJoin('users', 'users.user_id', 'ratings.rating_user')
    .select(
      'user_id',
      'user_name',
      'rating_id',
      'rating_last_updated',
      'rating_stars',
      'rating_review'
    );

  reviews.forEach((review) => {
    review.rating_last_updated = moment(review.rating_last_updated).format(
      'YYYY-MM-DD'
    );
  });

  let userReview = reviews.find((r) => r.user_id === parseInt(req.cookies.uid));
  let user = await getLoggedUser(req);

  res.status(200).render('song', {
    song,
    reviews,
    userReview,
    isLoggedIn: !!req.cookies.uid,
    user,
  });
};

exports.addSong = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('forbidden request, you are not an artist');
    return;
  }

  let albums = await knex('albums')
    .where('album_artist', req.cookies.sid)
    .select('album_id', 'album_name');

  let user = await getLoggedUser(req);

  res.status(200).render('add_song', { user, albums, isUpdate: false });
};

exports.deleteSong = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('forbidden request, you are not an artist');
    return;
  }

  let { songId } = req.body;

  await knex('songs').where('song_id', songId).del();
  res.end();
};

exports.updateSong = async (req, res) => {
  if (!req.cookies.sid) {
    res.status(403).send('forbidden request, you are not an artist');
    return;
  }

  let { id } = req.query;

  let song = await knex('songs').where('song_id', id).select('*').first();

  song.song_releasedate = moment(song.song_releasedate).format('YYYY-MM-DD');

  let albums = await knex('albums')
    .where('album_artist', req.cookies.sid)
    .select('album_id', 'album_name');

  let user = await getLoggedUser(req);

  res.status(200).render('add_song', { user, albums, isUpdate: true, song });
};
