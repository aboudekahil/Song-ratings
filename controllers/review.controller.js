const connection = require('../config/_database.config');
const moment = require('moment');
const knex = require('../config/knex.config');

exports.updateReview = async (req, res) => {
  const { id, stars, review } = req.body;

  await knex('ratings')
    .where('rating_id', '=', id)
    .update({
      rating_stars: stars,
      rating_review: review,
      ratings_last_updated: moment().format('YYYY-MM-DD'),
    });

  res.redirect('/');
};

exports.addReview = async (req, res) => {
  const { stars, review, song } = req.body;
  await knes('ratings').insert({
    rating_stars: stars,
    rating_review: review,
    rating_user: req.cookies.uid,
    rating_song: song,
    ratings_last_updated: moment().format('YYYY-MM-DD'),
  });

  res.redirect('/');
};
