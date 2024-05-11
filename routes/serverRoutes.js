//serverRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');

router.post('/rename-chat-history', controller.renameChatHistory);

router.post('/question', controller.handleQuestion);

router.get('/chat-history-list', controller.listChatHistoryFiles);

router.get('/chat-history/latest', controller.getLatestChatHistory);

router.get('/chat-history/:fileName', controller.viewChatHistory);

module.exports = router;