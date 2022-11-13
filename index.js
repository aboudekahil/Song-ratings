// Requires
// ----------------------------------------------------------------------------

const express = require('express');
const connectionPool = require('./config/database.config');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const getLoggedUser = require('./utils/getLoggedUser');

// File upload config
// ----------------------------------------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!(path.extname(file.originalname) in ['png', 'jpg', 'jpeg']))
      return cb(new Error('Only images are allowed'));

    cb(null, true);
  },

  limits: {
    fileSize: 1024 * 1024,
  },
});

// Server configuration
// ----------------------------------------------------------------------------

let pool = connectionPool.getPool();
let app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
  let user = await getLoggedUser(req);

  res.status(200).render('homepage', { user });
});

// app.post('/upload', upload.single('avatar'), (req, res) => {
//   // console.log(req.file);
// });

// Server run
// ----------------------------------------------------------------------------

const PORT = 3001;
app.listen(PORT);

console.log(`Server running on http://localhost:${PORT}`);

// Host static files
// ----------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')));
