const knex = require('../config/knex.config');
const utils = require('../utils/fuzzySearch');

exports.getResults = async (req, res) => {
  const { query } = req.query;

  let results = {
    songs: await utils.fuzzySearch('songs', 'song_name', query).select('*'),
    albums: await utils.fuzzySearch('albums', 'album_name', query),
    artists: await utils.artistFuzzySearch(query),
  };

  res.render('search_result', {query, results});
};
