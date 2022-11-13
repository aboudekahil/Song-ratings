var express = require('express');
var router = express.Router();

const album = require('../controllers/album.controller');

router.get('/artists/:artistName/albums/:albumName', album.getAlbum);
router.post('/api/addAlbum', album.addAlbum);
router.put('/api/updateAlbum', album.updateAlbum);

module.exports = router;
