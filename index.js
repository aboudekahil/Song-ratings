// Requires
// ----------------------------------------------------------------------------

const express = require('express');
const connectionPool = require('./config/database.config');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const knex = require('./config/knex.config');

// Server configuration
// ----------------------------------------------------------------------------

let pool = connectionPool.getPool();
let app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
// ----------------------------------------------------------------------------

const routes = fs.readdirSync(path.join(__dirname, 'routes'));
routes.forEach((route) => {
  let thisRoute = require(path.join(__dirname, 'routes', route));
  app.use('/', thisRoute);
});

// Home page
// ----------------------------------------------------------------------------

app.get('/', async (req, res) => {
  if (!req.cookies.uid) {
    res.status(200).render('homepage', { user: 0 });
    return;
  }
  let user = (
    await knex('users').where('user_id', req.cookies.uid).select('*')
  )[0];

  res.status(200).render('homepage', { user });
});

// Server run
// ----------------------------------------------------------------------------

const PORT = 3001;
app.listen(PORT);

console.log(`Server running on http://localhost:${PORT}`);

// Host static files
// ----------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')));
