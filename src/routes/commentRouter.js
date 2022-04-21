const express = require('express');
const commentController = require('../controllers/commentController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(commentController.getComments)
  .post(protect, commentController.createComment);

router
  .route('/:id')
  .get(commentController.getComment)
  .delete(protect, commentController.deleteComment);

router
  .route('/:id/upvote')
  .post(protect, commentController.upvoteComment)
  .delete(protect, commentController.removeUpvote);

router
  .route('/:id/downvote')
  .post(protect, commentController.downvoteComment)
  .delete(protect, commentController.removeDownvote);

module.exports = router;
