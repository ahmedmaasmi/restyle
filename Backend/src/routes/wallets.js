const express = require('express');
const router = express.Router();
const walletsController = require('../controllers/walletsController');

router.get('/', walletsController.getWallets);
router.post('/', walletsController.addWallet);
router.put('/', walletsController.updateWallet);

module.exports = router;
