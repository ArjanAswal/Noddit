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
  .patch(
    passport.authenticate('jwt', { session: false }),
    replyController.upvoteReply
  );

router
  .route('/:id/downvote')
  .patch(
    passport.authenticate('jwt', { session: false }),
    replyController.downvoteReply
  );

module.exports = router;
