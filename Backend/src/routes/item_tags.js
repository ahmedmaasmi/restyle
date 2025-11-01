const express = require('express');
const router = express.Router();
const itemTagsController = require('../controllers/item_tagsController');

router.get('/', itemTagsController.getItemTags);
router.post('/', itemTagsController.addItemTag);
router.delete('/', itemTagsController.deleteItemTag);

module.exports = router;
