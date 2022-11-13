var express = require('express');
var router = express.Router();

const songs = require('../controllers/song.controller');

router.get('/artists/:artistName/songs/:songName', songs.getSong);
router.get('/addSong', songs.addSong);
router.get('/updateSong', songs.updateSong);
router.post('/api/addSong', songs.addASong);
router.post('/api/updateSong', songs.updateASong);
router.post('/api/deleteSong', songs.deleteSong);

module.exports = router;
