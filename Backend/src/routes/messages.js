const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/', messagesController.getMessages);
router.post('/', messagesController.addMessage);

module.exports = router;
