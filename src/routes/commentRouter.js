const express = require('express');
const commentController = require('../controllers/commentController');
const passport = require('passport');
const router = express.Router();

router
  .route('/')
  .get(commentController.getComments)
  .post(
    passport.authenticate('jwt', { session: false }),
    commentController.createComment
  );

router
  .route('/:id')
  .get(commentController.getComment)
  .delete(
    passport.authenticate('jwt', { session: false }),
    commentController.deleteComment
  );

router
  .route('/:id/upvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    commentController.upvoteComment
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    commentController.removeUpvote
  );

router
  .route('/:id/downvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    commentController.downvoteComment
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    commentController.removeDownvote
  );

module.exports = router;
