var express = require('express');
var router = express.Router();

const songs = require('../controllers/song.controller');

router.get('/song', songs.getSong);
router.get('/addSong', songs.addSong);
router.post('/api/addSong', songs.addASong);
router.put('/api/updateSong', songs.updateSong);

module.exports = router;
