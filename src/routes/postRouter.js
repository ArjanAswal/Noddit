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
  .route('/:id')
  .get(postController.getPost)
  .delete(
    passport.authenticate('jwt', { session: false }),
    postController.deletePost
  );

router
  .route('/:id/upvote')
  .patch(
    passport.authenticate('jwt', { session: false }),
    postController.upvotePost
  );

router
  .route('/:id/downvote')
  .patch(
    passport.authenticate('jwt', { session: false }),
    postController.downvotePost
  );

module.exports = router;
