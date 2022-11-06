const connection = require('../config/_database.config');
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
