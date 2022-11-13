const knex = require('../config/knex.config');
const utils = require('../utils/fuzzySearch');
const getLoggedUser = require('../utils/getLoggedUser');

exports.getResults = async (req, res) => {
  const { query } = req.query;

  let results = {
    songs: await utils
      .fuzzySearch('songs', 'song_name', query)
      .innerJoin('artists', 'song_artist', '=', 'artist_id')
      .select('song_name', 'artist_stagename'),
    albums: await utils
      .fuzzySearch('albums', 'album_name', query)
      .innerJoin('artists', 'album_artist', '=', 'artist_id')
      .select('album_name', 'artist_stagename'),
    artists: await utils.artistFuzzySearch(query),
  };

  let foundAny =
    results.albums.length || results.artists.length || results.songs.length;

  let user = await getLoggedUser(req);

  res.render('search_result', { query, results, foundAny, user });
};
