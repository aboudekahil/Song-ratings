const knex = require('../config/knex.config');

exports.addCountry = async (req, res) => {
  const { name, abbr } = req.body;

  await knex('countries').insert({
    country_name: name,
    country_abbr: abbr,
  });

  res.redirect('/');
};

exports.updateCountry = async (req, res) => {
  const { id, name, abbr } = req.body;

  await knex('countries').where('country_id', '=', id).update({
    country_name: name,
    country_abbr: abbr,
  });

  res.redirect('/');
};
