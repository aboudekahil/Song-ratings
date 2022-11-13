const moment = require('moment');
const knex = require('../config/knex.config');

exports.updateReview = async (req, res) => {
  const { id, stars, review } = req.body;

  await knex('ratings')
    .where('rating_user', req.cookies.uid)
    .andWhere('rating_id', id)
    .update({
      rating_stars: stars,
      rating_review: review,
      rating_last_updated: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

  res.redirect('back');
};

exports.addReview = async (req, res) => {
  const { stars, review, song } = req.body;
  if (
    !(stars && review && song) ||
    !(0 <= parseInt(stars) && parseInt(stars) <= 5)
  ) {
    res.status(400).send('bad request');
    return;
  }

  await knex('ratings').insert({
    rating_stars: stars,
    rating_review: review,
    rating_user: req.cookies.uid,
    rating_song: song,
    rating_last_updated: moment().format('YYYY-MM-DD'),
  });

  res.redirect('back');
};
