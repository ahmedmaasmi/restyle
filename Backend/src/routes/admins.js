const express = require('express');
const router = express.Router();
const adminsController = require('../controllers/adminsController');

router.get('/', adminsController.getAdmins);
router.post('/', adminsController.addAdmin);
router.put('/', adminsController.updateAdminRole);

module.exports = router;
