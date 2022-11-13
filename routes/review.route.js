var express = require('express');
var router = express.Router();

const review = require('../controllers/review.controller');

router.post('/api/addReview', review.addReview);

router.post('/api/updateReview', review.updateReview);

module.exports = router;
