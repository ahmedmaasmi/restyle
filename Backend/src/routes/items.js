const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

router.get('/', itemsController.getItems);
router.post('/', itemsController.addItem);
router.post('/bulk', itemsController.bulkInsertItems);
router.post('/bulk-for-accounts', itemsController.bulkInsertItemsForAccounts);
router.put('/', itemsController.updateItem);

module.exports = router;
