const express = require('express');
const replyController = require('../controllers/replyController');
const { protect } = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .get(replyController.getReplies)
  .post(protect, replyController.createReply);

router
  .route('/:id')
  .get(replyController.getReply)
  .delete(protect, replyController.deleteReply);

router
  .route('/:id/upvote')
  .post(protect, replyController.upvoteReply)
  .delete(protect, replyController.removeUpvote);

router
  .route('/:id/downvote')
  .post(protect, replyController.downvoteReply)
  .delete(protect, replyController.removeDownvote);

module.exports = router;
