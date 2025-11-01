const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

router.get('/', itemsController.getItems);
router.post('/', itemsController.addItem);
router.put('/', itemsController.updateItem);

module.exports = router;
