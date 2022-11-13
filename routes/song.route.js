var express = require('express');
var router = express.Router();

const songs = require('../controllers/song.controller');

router.get('/artists/:artistName/songs/:songName', songs.getSong);
router.get('/addSong', songs.addSong);
router.post('/api/addSong', songs.addASong);
router.post('/api/updateSong', songs.updateSong);

module.exports = router;
