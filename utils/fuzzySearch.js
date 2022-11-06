const knex = require('../config/knex.config');

exports.fuzzySearch = (table, column, query) => {
  return knex(table)
    .whereRaw(`SOUNDEX(??) LIKE SOUNDEX('%${query}%')`, [column])
    .orWhereILike(column, `%${query}%`);
};

exports.artistFuzzySearch = (query) => {
  return this.fuzzySearch('artists', 'artist_stagename', query)
    .innerJoin('users', 'artists.artist_user_email', '=', 'users.user_email')
    .whereRaw(`SOUNDEX(??) LIKE SOUNDEX('%${query}%')`, 'user_name')
    .orWhereILike('user_name', `%${query}%`)
    .select('artist_id', 'artist_stagename', 'user_email', 'user_name');
};
