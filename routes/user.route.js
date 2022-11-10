var express = require('express');
var router = express.Router();

const user = require('../controllers/user.controller');

router.get('/p/:username', user.getProfile);

module.exports = router;
