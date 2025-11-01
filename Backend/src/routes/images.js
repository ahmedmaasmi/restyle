const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/imagesController');

router.get('/', imagesController.getImages);
router.get('/item/:item_id', imagesController.getImagesByItemId);
router.post('/', imagesController.addImage);
router.put('/', imagesController.updateImage);

module.exports = router;
