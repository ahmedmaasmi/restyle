const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);
router.post('/', categoriesController.addCategory);
router.put('/', categoriesController.updateCategory);

module.exports = router;
