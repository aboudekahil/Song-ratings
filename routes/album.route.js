var express = require('express');
var router = express.Router();

const album = require('../controllers/album.controller');

router.get('/artists/:artistName/albums/:albumName', album.getAlbum);
router.get('/addAlbum', album.addAlbum);
router.get('/updateAlbum', album.updateAlbum);
router.post('/api/addAlbum', album.addAnAlbum);
router.put('/api/updateAlbum', album.updateAnAlbum);
router.post('/api/deleteAlbum', album.deleteAlbum);

module.exports = router;
