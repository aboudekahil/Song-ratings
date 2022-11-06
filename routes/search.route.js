var express = require('express');
var router = express.Router();

const search = require('../controllers/search.controller');

router.get('/query', search.getResults);

module.exports = router;
