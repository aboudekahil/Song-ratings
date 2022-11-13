const knex = require('../config/knex.config');
const getLoggedUser = require('../utils/getLoggedUser');

exports.getArtist = async (req, res) => {
  let { artistName } = req.params;

  let artist = await knex('artists')
    .where('artist_stagename', artistName)
    .select('*')
    .first();

  let user = await getLoggedUser(req);

  let songs = await knex('songs')
    .where('song_artist', artist.artist_id)
    .select('*');

  let albums = await knex('albums')
    .where('album_artist', artist.artist_id)
    .select('*');

  let isThisArtist = artist.artist_id === parseInt(req.cookies.sid);

  res.render(
    'artist',
    {
      user,
      artist,
      songs,
      albums,
      isThisArtist,
    }
  );
};
