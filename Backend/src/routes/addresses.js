const express = require('express');
const router = express.Router();
const addressesController = require('../controllers/addressesController');

router.get('/', addressesController.getAddresses);
router.post('/', addressesController.addAddress);
router.put('/', addressesController.updateAddress);

module.exports = router;
