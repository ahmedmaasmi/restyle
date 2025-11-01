const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.get('/', reviewsController.getReviews);
router.post('/', reviewsController.addReview);
router.put('/', reviewsController.updateReview);

module.exports = router;
