// Requires
// ----------------------------------------------------------------------------

const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connection = require('./configuration/database.config');

// Server configuration
// ----------------------------------------------------------------------------

let app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// Post Requests
// ----------------------------------------------------------------------------

app.post('/api/register', (req, res) => {
  const { name, email, password, country, isArtist, stageName, dob } = req.body;

  let isArtistBool = !!isArtist;

  let SQL = `INSERT INTO \`users\` 
                (\`user_email\`, \`user_name\`, \`user_password\`, \`user_country\`
                , \`user_is_artist\`, \`user_dob\`)
             VALUES
                ("${email}", "${name}", "${password}", "${country}",
                 "${+isArtistBool}", "${moment(dob).format('YYYY-MM-DD')}");`;

  if (isArtistBool) {
    SQL += `INSERT INTO \`artists\` 
                (\`artist_stagename\`, \`artist_user_email\`)
            VALUES
                ("${stageName}", "${email}");`;
  }

  connection.query(SQL, (err, data) => {
    if (err) throw err;
  });

  connection.query(
    `SELECT \`user_id\` 
     FROM \`users\`
     WHERE \`user_email\` = "${email}";
     
     SELECT \`artist_id\`
     FROM artists
     WHERE \`artist_user_email\`="${email}";`,
    (err, data) => {
      if (err) throw err;
      console.log(data);
      res.cookie('uid', data[0][0].user_id, {
        maxAge: 5000,
        secure: true,
        httpOnly: true,
      });
      res.cookie('sid', data[1][0].artist_id, {
        maxAge: 500000000000,
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
      });
      res.redirect('/');
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  let SQL = `SELECT \`user_id\` 
             FROM users
             WHERE \`user_email\`="${email}" AND \`user_password\`="${password}";
             SELECT \`artist_id\`
             FROM artists
             WHERE \`artist_user_email\`="${email}";`;

  connection.query(SQL, (err, data) => {
    if (err) throw err;
    if (!data) res.redirect('http://youtube.com');
    res.cookie('uid', data[0][0].user_id, {
      maxAge: 500000000000,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('sid', data[1][0].artist_id, {
      maxAge: 500000000000,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    });
    res.redirect('/');
  });
});

app.post('/api/saveSong', (req, res) => {
  const { id, name, length, artist, album, releaseDate } = req.body;

  let SQL;

  if (parseInt(id)) {
    SQL = `UPDATE \`songs\`
          SET song_name,song_length, song_artist, song_in_album
          WHERE song_id=${id}`;
  } else {
    SQL = `INSERT INTO \`songs\` (song_name, song_length, song_artist, song_in_album, song_releasedate) 
    VALUES ("${name}", "${length}", "${artist}", "${album}", "${moment(
      releaseDate
    ).format('YYYY-MM-DD')}")`;
  }

  connection.query(SQL, (err, data) => {
    res.status(200).send('Song Saved');
  });
});

app.post('/api/saveAlbum', (req, res) => {
  const { id, name, releaseDate } = req.body;

  let SQL;
  if (parseInt(id)) {
    SQL = `UPDATE \`albums\` 
          SET album_name="${name}", 
          album_releasedate="${moment(releaseDate).format('YYYY-MM-DD')}" 
          WHERE album_id=${id}`;
  } else {
    SQL = `INSERT INTO \`albums\` 
          (album_name, album_releasedate) 
          VALUES ("${name}", "${moment(releaseDate).format('YYYY-MM-DD')}")`;
  }

  connection.query(SQL, (err, data) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.post('/api/saveCountry', (req, res) => {
  const { id, name, abbr } = req.body;

  let SQL;
  if (parseInt(id)) {
    SQL = `UPDATE \`countries\`
          SET \`country_name\`="${name}", \`country_abbr\`="${abbr}"
          WHERE country_id=${id}`;
  } else {
    SQL = `INSERT INTO \`countries\` (country_name, country_abbr) VALUES ("${name}", "${abbr}")`;
  }

  connection.query(SQL, (err, data) => {
    res.redirect('/');
  });
});

app.post('/api/saveReview', (req, res) => {
  const { id, stars, review, user, song } = req.body;

  let SQL;
  if (parseInt(id)) {
    SQL = `UPDATE \`ratings\`
           SET \`rating_stars\`=${stars}, \`rating_review\`=${review}
           WHERE \`rating_id\`=${id}`;
  } else {
    SQL = `INSERT INTO \`ratings\` 
              (\`rating_stars\`, \`rating_review\`,\`rating_user\`, \`rating_song\`)
           VALUES
              (${stars}, "${review}", "${user}", ${song});`;
  }

  connection.query(SQL, (err, data) => {
    if (err) throw err;
  });
});

// Get Requests
// ----------------------------------------------------------------------------

app.get('/', (req, res) => {
  if (!req.cookies.uid) {
    res.render('homepage', { user: 0 });
    return;
  }
  connection.query(
    `SELECT * FROM users WHERE user_id=${req.cookies.uid}`,
    (err, data) => {
      if (err) throw err;
      res.render('homepage', { user: data[0] });
    }
  );
});

app.get('/song', (req, res) => {
  const { id } = req.body;
  if (!id) {
    connection.query(
      `SELECT * FORM songs WHERE song_id=${id};`,
      (err, data) => {
        if (err) {
          res.status(404).send('Undefined song.');
          return;
        }
        res.render('song', { song: data[0] });
      }
    );
  }
});

app.get('/join', (req, res) => {
  let SQL = 'SELECT * FROM countries;';

  connection.query(SQL, (err, data) => {
    res.render('join', { countries: data });
  });
});

app.get('/saveAlbum', (req, res) => {
  res.render('save_album');
});

app.get('/saveSong', (req, res) => {
  if (!req.cookies.uid) {
    res.status;
  }
  SQL = `SELECT * FROM albums WHERE album_artist=${req.cookies.sid}`;
  res.render('save_song', { id: req.cookies.sid });
});

app.get('/saveCountry', (req, res) => {
  res.render('save_country');
});

// Server run
// ----------------------------------------------------------------------------

const PORT = 3001;
app.listen(PORT);

console.log(`Server running on http://localhost:${PORT}`);
