var express = require('express');
var router = express.Router();

const sign = require('../controllers/sign.controller');

router.get('/join', sign.joinPage);

router.post('/api/register', sign.register);
router.post('/api/login', sign.logIn);
router.post('/api/signOut', sign.signOut);

module.exports = router;
