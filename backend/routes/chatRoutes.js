const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  accessConversation,
  getConversations,
  sendMessage,
  getMessages
} = require('../controllers/chatController');

router.route('/').post(protect, accessConversation).get(protect, getConversations);
router.route('/message').post(protect, sendMessage);
router.route('/:conversationId/messages').get(protect, getMessages);

module.exports = router;