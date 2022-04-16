const express = require('express');
const postController = require('../controllers/postController');
const passport = require('passport');
const router = express.Router();

router
  .route('/')
  .get(postController.getPosts)
  .post(
    passport.authenticate('jwt', { session: false }),
    postController.createPost
  );

router
  .route('/feed')
  .get(
    passport.authenticate('jwt', { session: false }),
    postController.getFeed
  );

router
  .route('/:id')
  .get(postController.getPost)
  .delete(
    passport.authenticate('jwt', { session: false }),
    postController.deletePost
  );

router
  .route('/:id/upvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    postController.upvotePost
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    postController.removeUpvote
  );

router
  .route('/:id/downvote')
  .post(
    passport.authenticate('jwt', { session: false }),
    postController.downvotePost
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    postController.removeDownvote
  );

module.exports = router;
