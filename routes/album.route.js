var express = require('express');
var router = express.Router();

const album = require('../controllers/album.controller');

router.post('/api/addAlbum', album.addAlbum);
router.put('/api/updateAlbum', album.updateAlbum);
router.get('/saveAlbum', async (req, res) => {
  res.status(200).render('save_album');
});

module.exports = router;
