var express = require('express');
var router = express.Router();

const country = require('../controllers/country.controller');

router.post('/api/addCountry', country.addCountry);

router.put('/api/updateCountry', country.updateCountry);

module.exports = router;
