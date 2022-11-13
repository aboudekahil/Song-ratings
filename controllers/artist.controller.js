const knex = require('../config/knex.config');
const getLoggedUser = require('../utils/getLoggedUser');

exports.getArtist = async (req, res) => {
  let { artistName } = req.params;

  let artist = await knex('artists')
    .where('artist_stagename', artistName)
    .select('*')
    .first();

  let user = await getLoggedUser(req);

  res.render('artist', { user, artist });
};
