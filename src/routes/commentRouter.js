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
  .patch(
    passport.authenticate('jwt', { session: false }),
    commentController.upvoteComment
  );

router
  .route('/:id/downvote')
  .patch(
    passport.authenticate('jwt', { session: false }),
    commentController.downvoteComment
  );

module.exports = router;
