var express = require('express');
var router = express.Router();

const user = require('../controllers/user.controller');

router.get('/profiles/:username', user.getProfile);
router.get('/editProfile', user.getEditProfile);

router.post('/api/editProfile', user.editProfile);

module.exports = router;
