var express = require('express');
var router = express.Router();

const artist = require('../controllers/artist.controller');

router.get('/artists/:artistName', artist.getArtist);

module.exports = router;
