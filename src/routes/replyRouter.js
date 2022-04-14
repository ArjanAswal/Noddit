const express = require('express');
const replyController = require('../controllers/replyController');
const passport = require('passport');
const router = express.Router();

router
  .route('/')
  .get(replyController.getReplies)
  .post(
    passport.authenticate('jwt', { session: false }),
    replyController.createReply
  );

router
  .route('/:id')
  .get(replyController.getReply)
  .delete(
    passport.authenticate('jwt', { session: false }),
    replyController.deleteReply
  );

router
  .route('/:id/upvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    replyController.upvoteReply
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    replyController.removeUpvote
  );

router
  .route('/:id/downvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    replyController.downvoteReply
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    replyController.removeDownvote
  );

module.exports = router;
